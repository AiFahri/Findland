<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandListing;
use App\Models\PropertyListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

            $landListing = LandListing::findOrFail($id);

            if ($landListing->admin_status !== 'pending') {
                throw new \Exception('This listing has already been processed.');
            }

            // Update land listing status
            $landListing->update([
                'admin_status' => $validatedData['admin_status'],
                'admin_notes' => $validatedData['admin_notes'] ?? null,
                'approved_by' => Auth::guard('admin')->id(),
                'approved_at' => now(),
            ]);

            // Only create property listing if admin_status is approved
            if ($validatedData['admin_status'] === 'approved') {
                $propertyDetails = $validatedData['property_details'];
                
                // Create new property listing
                PropertyListing::create([
                    'title' => $propertyDetails['title'],
                    'description' => $propertyDetails['description'],
                    'price' => $propertyDetails['price'],
                    'place' => $propertyDetails['place'],
                    'desc_detail' => $propertyDetails['desc_detail'],
                    'maps' => $propertyDetails['maps'],
                    'wa' => $propertyDetails['wa'],
                    'image' => $propertyDetails['image'],
                    'images' => $propertyDetails['images'] ?? [],
                    'status' => $propertyDetails['status'],
                    'featured' => $propertyDetails['featured'] ?? false,
                    'land_area' => $propertyDetails['land_area'] ?? null,
                    'certificate_type' => $propertyDetails['certificate_type'] ?? null,
                    'latitude' => $propertyDetails['latitude'] ?? null,
                    'longitude' => $propertyDetails['longitude'] ?? null,
                    'land_listing_id' => $landListing->id,
                    'user_id' => $landListing->user_id  // Tambahkan user_id dari land listing
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
        ]);

        $path = $request->file('image')->store('property', 'public');

        return response()->json([
            'path' => '/storage/' . $path,
        ]);
    }
}





