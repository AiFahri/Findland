<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandListing;
use App\Models\PropertyListing;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function totalListings()
    {
        $totalListings = LandListing::with(['user', 'images'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/PropertyList', [
            'totalListings' => $totalListings,
        ]);
    }

    public function pendingListings()
    {
        $pendingListings = LandListing::with(['user', 'images'])
            ->where('admin_status', 'pending')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/PendingListing', [
            'pendingListings' => $pendingListings,
        ]);
    }

    public function reviewListing($id)
    {
        $listing = LandListing::with(['user', 'images'])
            ->findOrFail($id);

        // Transform land_photos to include full paths
        $listing->land_photos = collect($listing->land_photos)->map(function ($photo) {
            return str_replace('public/', '', $photo);
        })->toArray();

        return Inertia::render('Admin/ReviewListing', [
            'listing' => $listing,
        ]);
    }

    public function approveListing(Request $request, $id)
    {
        try {
            // Debug log
            Log::info('Raw request data:', $request->all());

            // Parse property_details jika ada
            if ($request->has('property_details') && is_string($request->property_details)) {
                $propertyDetails = json_decode($request->property_details, true);
                $request->merge(['property_details' => $propertyDetails]);
            }

            $validatedData = $request->validate([
                'admin_status' => 'required|in:approved,rejected',
                'admin_notes' => 'nullable|string',
                'property_details' => 'required_if:admin_status,approved|array',
                'property_details.title' => 'required_if:admin_status,approved|string',
                'property_details.description' => 'required_if:admin_status,approved|string',
                'property_details.price' => 'required_if:admin_status,approved|numeric',
                'property_details.place' => 'required_if:admin_status,approved|string',
                'property_details.desc_detail' => 'required_if:admin_status,approved|string',
                'property_details.maps' => 'required_if:admin_status,approved|string',
                'property_details.wa' => 'required_if:admin_status,approved|string',
                'property_details.image' => 'required_if:admin_status,approved|string',
                'property_details.status' => 'required_if:admin_status,approved|in:Dijual,Disewa',
                'property_details.featured' => 'boolean|nullable',
                'property_details.land_area' => 'nullable|numeric',
                'property_details.certificate_type' => 'nullable|string',
                'property_details.latitude' => 'nullable|numeric',
                'property_details.longitude' => 'nullable|numeric',
            ]);

            DB::beginTransaction();

            $landListing = LandListing::with('user')->findOrFail($id);

            Log::info('Land Listing details:', [
                'id' => $landListing->id,
                'user_id' => $landListing->user_id,
                'user' => $landListing->user ? $landListing->user->id : 'No user found',
                'admin_status' => $landListing->admin_status,
                'is_paid' => $landListing->is_paid ? 'Yes' : 'No'
            ]);

            if ($landListing->admin_status !== 'pending') {
                throw new \Exception('This listing has already been processed.');
            }

            if (!$landListing->user_id) {
                throw new \Exception('Land Listing tidak memiliki user_id yang valid');
            }
            if ($validatedData['admin_status'] === 'approved' && !$landListing->is_paid) {
                throw new \Exception('Tidak dapat menyetujui listing yang belum dibayar. Silakan tunggu pembayaran selesai.');
            }

            $landListing->update([
                'admin_status' => $validatedData['admin_status'],
                'admin_notes' => $validatedData['admin_notes'] ?? null,
                'approved_by' => Auth::guard('admin')->id(),
                'approved_at' => now(),
            ]);

            // Only create property listing if admin_status is approved
            if ($validatedData['admin_status'] === 'approved') {
                // Ambil package berdasarkan package_id
                $package = Package::find($landListing->package_id);
                
                if ($package) {
                    // Gunakan duration dari package untuk menghitung expiry date
                    $expiryDate = now()->addMonths($package->duration);
                    
                    // Update expiry_date di land_listing
                    $landListing->update([
                        'expiry_date' => $expiryDate
                    ]);
                    
                    Log::info('Setting expiry date:', [
                        'land_listing_id' => $landListing->id,
                        'package_id' => $package->id,
                        'package_name' => $package->name,
                        'duration_months' => $package->duration,
                        'expiry_date' => $expiryDate
                    ]);
                } else {
                    Log::warning('Package not found when setting expiry date', [
                        'land_listing_id' => $landListing->id,
                        'package_id' => $landListing->package_id
                    ]);
                }
                $propertyDetails = $validatedData['property_details'];

                // Log property details for debugging
                Log::info('Creating property listing with details:', [
                    'land_listing_id' => $landListing->id,
                    'land_listing_user_id' => $landListing->user_id,
                    'property_details' => $propertyDetails
                ]);

                // Create new property listing
                // Pastikan user_id ada dan valid
                if (!$landListing->user_id) {
                    throw new \Exception('User ID tidak ditemukan pada land listing');
                }

                // Rename images to use consistent naming convention if they don't already follow it
                $mainImage = $propertyDetails['image'];
                $additionalImages = $propertyDetails['images'] ?? [];

                // Clean title for filename
                $cleanTitle = preg_replace('/[^a-zA-Z0-9]/', '', strtoupper($propertyDetails['title']));

                // Process main image
                $newMainImage = $this->renameImageIfNeeded($mainImage, $landListing->id, $cleanTitle, 1);

                // Process additional images
                $newAdditionalImages = [];
                foreach ($additionalImages as $index => $image) {
                    $newAdditionalImages[] = $this->renameImageIfNeeded($image, $landListing->id, $cleanTitle, $index + 2);
                }

                // Jika gambar tambahan masih kosong, coba ambil dari land_listing_images
                if (empty($newAdditionalImages)) {
                    Log::info('No additional images found in property_details, checking land_listing_images');

                    // Ambil gambar dari land_listing_images
                    $landListingImages = \App\Models\LandListingImage::where('land_listing_id', $landListing->id)->get();

                    Log::info('Found land_listing_images', [
                        'count' => $landListingImages->count(),
                        'images' => $landListingImages->pluck('path')->toArray()
                    ]);

                    // Proses gambar dari land_listing_images, skip gambar pertama jika sudah digunakan sebagai main image
                    $imageCounter = 2; // Mulai dari 2 karena 1 sudah digunakan untuk main image
                    foreach ($landListingImages as $landListingImage) {
                        // Skip jika path sama dengan main image
                        if ($landListingImage->path == $mainImage) {
                            continue;
                        }

                        $newPath = $this->renameImageIfNeeded($landListingImage->path, $landListing->id, $cleanTitle, $imageCounter);
                        $newAdditionalImages[] = $newPath;
                        $imageCounter++;

                        // Batasi maksimal 4 gambar (1 main + 3 additional)
                        if ($imageCounter > 4) {
                            break;
                        }
                    }

                    Log::info('Processed additional images from land_listing_images', [
                        'count' => count($newAdditionalImages),
                        'images' => $newAdditionalImages
                    ]);
                }

                // Buat array data untuk property listing
                $propertyData = [
                    'title' => $propertyDetails['title'],
                    'description' => $propertyDetails['description'],
                    'price' => $propertyDetails['price'],
                    'place' => $propertyDetails['place'],
                    'desc_detail' => $propertyDetails['desc_detail'],
                    'maps' => $propertyDetails['maps'],
                    'wa' => $propertyDetails['wa'],
                    'image' => $newMainImage,
                    'images' => $newAdditionalImages,
                    'status' => $propertyDetails['status'],
                    'featured' => $propertyDetails['featured'] ?? false,
                    'land_area' => $propertyDetails['land_area'] ?? null,
                    'certificate_type' => $propertyDetails['certificate_type'] ?? null,
                    'latitude' => $propertyDetails['latitude'] ?? null,
                    'longitude' => $propertyDetails['longitude'] ?? null,
                    'land_listing_id' => $landListing->id,
                    'user_id' => $landListing->user_id
                ];

                // Log data yang akan dimasukkan ke database
                Log::info('Property listing data to be inserted:', $propertyData);

                $propertyListing = PropertyListing::create($propertyData);

                Log::info('Property listing created successfully', [
                    'property_listing_id' => $propertyListing->id,
                    'land_listing_id' => $landListing->id
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Listing processed successfully']);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in approveListing: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Add new method for image upload
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'filename' => 'nullable|string',
        ]);

        if ($request->has('filename')) {
            // Gunakan nama file yang diberikan
            $path = $request->file('image')->storeAs('property', $request->filename, 'public');
        } else {
            // Gunakan nama acak seperti sebelumnya
            $path = $request->file('image')->store('property', 'public');
        }

        return response()->json([
            'path' => '/storage/' . $path,
        ]);
    }

    /**
     * Extend the expiry date of a property listing
     */
    public function extendExpiry(Request $request, $id)
    {
        try {
            $request->validate([
                'months' => 'required|integer|min:1|max:12',
            ]);

            DB::beginTransaction();

            $landListing = LandListing::findOrFail($id);

            // Calculate new expiry date
            $currentExpiry = $landListing->expiry_date ?? now();
            $newExpiry = $currentExpiry->addMonths($request->months);

            Log::info('Extending expiry date:', [
                'land_listing_id' => $landListing->id,
                'current_expiry' => $currentExpiry,
                'extension_months' => $request->months,
                'new_expiry' => $newExpiry
            ]);

            // Update expiry date
            $landListing->update([
                'expiry_date' => $newExpiry
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Expiry date extended successfully',
                'expiry_date' => $newExpiry->format('Y-m-d H:i:s')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error extending expiry date: ' . $e->getMessage());

            return response()->json([
                'error' => 'Failed to extend expiry date: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Rename image file to follow consistent naming convention if needed
     *
     * @param string $imagePath Original image path
     * @param int $landListingId Land listing ID
     * @param string $cleanTitle Clean title for filename
     * @param int $imageNumber Image number (1-4)
     * @return string New image path
     */
    private function renameImageIfNeeded($imagePath, $landListingId, $cleanTitle, $imageNumber)
    {
        // If path is empty or null, return as is
        if (empty($imagePath)) {
            return $imagePath;
        }

        // Log untuk debugging
        Log::info('Renaming image if needed', [
            'original_path' => $imagePath,
            'land_listing_id' => $landListingId,
            'clean_title' => $cleanTitle,
            'image_number' => $imageNumber
        ]);

        // Check if the image already follows our naming convention
        $pattern = "/property_{$landListingId}_{$cleanTitle}_\d+\.(jpg|jpeg|png)$/i";
        if (preg_match($pattern, $imagePath)) {
            Log::info('Image already follows naming convention', ['path' => $imagePath]);
            return $imagePath;
        }

        // Get file extension
        $extension = pathinfo($imagePath, PATHINFO_EXTENSION);

        // Jika tidak ada ekstensi, coba deteksi dari konten file
        if (empty($extension)) {
            // Coba cek apakah file ada dengan ekstensi lain
            $possibleExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            $basePathWithoutExt = $imagePath;

            foreach ($possibleExtensions as $ext) {
                $testPath = "{$basePathWithoutExt}.{$ext}";
                if (Storage::disk('public')->exists($testPath)) {
                    $extension = $ext;
                    $imagePath = $testPath; // Update path dengan ekstensi yang ditemukan
                    Log::info('Found file with extension', ['path' => $testPath]);
                    break;
                }
            }

            // Jika masih tidak ada ekstensi, gunakan jpg sebagai default
            if (empty($extension)) {
                $extension = 'jpg';
            }
        }

        // Generate new filename
        $newFileName = "property_{$landListingId}_{$cleanTitle}_{$imageNumber}.{$extension}";

        // Pastikan direktori adalah 'property'
        $directory = 'property';
        $newPath = $directory . '/' . $newFileName;

        try {
            // Check if source file exists
            if (Storage::disk('public')->exists($imagePath)) {
                // Copy file with new name
                Storage::disk('public')->copy($imagePath, $newPath);
                Log::info('Image renamed successfully', [
                    'from' => $imagePath,
                    'to' => $newPath
                ]);

                return $newPath;
            } else {
                Log::warning('Source image not found', ['path' => $imagePath]);
                return $imagePath; // Return original if source not found
            }
        } catch (\Exception $e) {
            Log::error('Error renaming image', [
                'message' => $e->getMessage(),
                'path' => $imagePath
            ]);
            return $imagePath; // Return original on error
        }
    }
}

