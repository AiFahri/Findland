<?php

namespace App\Http\Controllers;

use App\Models\LandListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LandListingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'birth_place_date' => 'required|string|max:255',
            'address' => 'required|string',
            'ktp_id' => 'required|string|unique:land_listings,ktp_id',
            'religion' => 'required|string|max:100',
            'monthly_income' => 'required|numeric|min:0',
            'phone_number' => 'required|string|max:15',
            'npwp' => 'required|string|max:20',
            'ktp_scan' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'land_photos' => 'required|array|min:4|max:4', // HARUS 4 FOTO
            'land_photos.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);
        $ktpPath = $request->file('ktp_scan')->store('ktp_scans', 'public');
        $photoPaths = [];
        foreach ($request->file('land_photos') as $photo) {
            $photoPaths[] = $photo->store('land_photos', 'public');
        }
        LandListing::create([
            'user_id' => Auth::id(),
            'full_name' => $request->full_name,
            'birth_place_date' => $request->birth_place_date,
            'address' => $request->address,
            'ktp_id' => $request->ktp_id,
            'religion' => $request->religion,
            'monthly_income' => $request->monthly_income,
            'phone_number' => $request->phone_number,
            'npwp' => $request->npwp,
            'ktp_scan' => $ktpPath,
            'land_photos' => json_encode($photoPaths), // Simpan sebagai JSON
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Pengajuan jual lahan berhasil dikirim!');
    }

    // Admin Approval
    public function approve($id)
    {
        $listing = LandListing::findOrFail($id);
    
        // Pastikan hanya listing yang sudah dibayar yang bisa di-approve
        if ($listing->status !== 'paid') {
            return redirect()->back()->with('error', 'Listing belum dibayar!');
        }
    
        $listing->update(['status' => 'approved']);
        return redirect()->back()->with('success', 'Jual lahan telah disetujui.');
    }
    

    public function reject($id)
    {
        $listing = LandListing::findOrFail($id);
        $listing->update(['status' => 'rejected']);
        return redirect()->back()->with('error', 'Jual lahan telah ditolak.');
    }
    public function create(Request $request)
{
    $packageId = $request->query('package'); 
    return Inertia::render('Layanan/Jual', [
        'packageId' => $packageId ?? null, 
    ]);
    }

}
