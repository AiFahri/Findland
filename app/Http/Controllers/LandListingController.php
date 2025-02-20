<?php

namespace App\Http\Controllers;

use App\Models\LandListing;
use App\Models\LandListingImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LandListingController extends Controller
{
    private $packages = [
        1 => ['name' => 'Starter', 'price' => 334000, 'duration' => '1 Bulan'],
        2 => ['name' => 'Enterprise', 'price' => 1000000, 'duration' => '3 Bulan'],
        3 => ['name' => 'Lite', 'price' => 1900000, 'duration' => '6 Bulan'],
        4 => ['name' => 'Pro', 'price' => 3800000, 'duration' => '12 Bulan']
    ];

    public function create(Request $request)
    {
        $packageId = $request->query('package');
        $selectedPackage = null;

        if ($packageId && isset($this->packages[$packageId])) {
            $selectedPackage = $this->packages[$packageId];
        }

        return Inertia::render('Layanan/Jual', [
            'packageId' => $selectedPackage ? $packageId : null
        ]);
    }
    public function store(Request $request)
    {
        Log::info('Land Listing Submission', [
            'user_id' => Auth::id(),
            'request_data' => $request->all(),
            'files' => $request->allFiles()
        ]);
    
        try {
            $validatedData = $request->validate([
                'package_id' => 'nullable|in:1,2,3,4',
                'full_name' => 'required|string|max:255',
                'birth_place_date' => 'required|string|max:255',
                'address' => 'required|string',
                'ktp_id' => 'required|string|unique:land_listings,ktp_id',
                'religion' => 'required|string|max:100',
                'monthly_income' => 'required|numeric|min:0',
                'phone_number' => 'required|string|max:15',
                'npwp' => 'required|string|max:20',
                'ktp_scan' => 'required|image|mimes:jpeg,png,jpg|max:2048',
                'land_photos' => 'required|array|min:4|max:4',
                'land_photos.*' => 'image|mimes:jpeg,png,jpg|max:2048'
            ]);
    
            DB::beginTransaction();
    
            $ktpPath = $request->file('ktp_scan')->store('ktp_scans', 'public');
            Log::info('KTP Scan Path', ['path' => $ktpPath]);
    
            $photoPaths = [];
            foreach ($request->file('land_photos') as $photo) {
                $path = $photo->store('land_photos', 'public');
                $photoPaths[] = $path;
            }
    
            // Create Land Listing
            $landListing = LandListing::create([
                'user_id' => Auth::id(),
                'full_name' => $validatedData['full_name'],
                'birth_place_date' => $validatedData['birth_place_date'],
                'address' => $validatedData['address'],
                'ktp_id' => $validatedData['ktp_id'],
                'religion' => $validatedData['religion'],
                'monthly_income' => $validatedData['monthly_income'],
                'phone_number' => $validatedData['phone_number'],
                'npwp' => $validatedData['npwp'],
                'ktp_scan' => $ktpPath,
                'package_id' => $request->input('package_id'),
                'land_photos' => $photoPaths, 
                'admin_status' => 'pending'
            ]);
            Log::info('Land Listing Created', ['id' => $landListing->id]);
    
            foreach ($photoPaths as $path) {
                LandListingImage::create([
                    'land_listing_id' => $landListing->id,
                    'path' => $path
                ]);
            }
    
            DB::commit();
    
            return redirect()->route('home')->with('success', 'Pengajuan lahan Anda berhasil dikirim. Silakan tunggu konfirmasi admin.');
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Land Listing Submission Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
    
            if (isset($ktpPath)) {
                Storage::disk('public')->delete($ktpPath);
            }
            foreach ($photoPaths ?? [] as $path) {
                Storage::disk('public')->delete($path);
            }
    
            return back()->withErrors(['submission' => 'Gagal mengirim pengajuan: ' . $e->getMessage()]);
        }
    }
}