<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandListing;
use App\Models\PropertyListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function totalListings()
    {
        $totalListings = LandListing::with(['user', 'images'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/PropertyList', [
            'totalListings' => $totalListings
        ]);
    }

    public function pendingListings()
    {
        $pendingListings = LandListing::with(['user', 'images'])
            ->where('admin_status', 'pending')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/PendingListing', [
            'pendingListings' => $pendingListings
        ]);
    }

    public function reviewListing($id)
    {
        $listing = LandListing::with(['user', 'images'])
            ->findOrFail($id);

        return Inertia::render('Admin/ReviewListing', [
            'listing' => $listing
        ]);
    }

    public function approveListing(Request $request, $id)
{
    $validatedData = $request->validate([
        'status' => 'required|in:approved,rejected',
        'admin_notes' => 'nullable|string',
        'property_details' => 'nullable|array'
    ]);

    $landListing = LandListing::findOrFail($id);
    $landListing->update([
        'admin_status' => $validatedData['status'],
        'admin_notes' => $validatedData['admin_notes'] ?? null,
        'approved_by' => Auth::guard('admin')->id(),
        'approved_at' => now()
    ]);

    // If approved, create or update PropertyListing
    if ($validatedData['status'] === 'approved') {
        $propertyDetails = $validatedData['property_details'] ?? [];

        $propertyListing = PropertyListing::updateOrCreate(
            ['land_listing_id' => $landListing->id],
            [
                'user_id' => $landListing->user_id,
                'title' => $propertyDetails['title'] ?? ($landListing->full_name . ' - Land Listing'),
                'description' => $propertyDetails['description'] ?? $landListing->address,
                'price' => $propertyDetails['price'] ?? $landListing->monthly_income,
                'location' => $propertyDetails['location'] ?? $landListing->address,
                'land_area' => $propertyDetails['land_area'] ?? null,
                'certificate_type' => $propertyDetails['certificate_type'] ?? null,
                'status' => 'active',
                'featured' => $propertyDetails['featured'] ?? false,
                'latitude' => $propertyDetails['latitude'] ?? null,
                'longitude' => $propertyDetails['longitude'] ?? null
            ]
        );
    }

    return redirect()->route('admin.properties.pending')
        ->with('success', 'Listing has been ' . $validatedData['status']);
}
}