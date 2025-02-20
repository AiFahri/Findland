<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandListing;
use App\Models\PropertyListing;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        if (!Auth::guard('admin')->check()) {
            return redirect()->route('admin.login')
                ->with('error', 'You must be logged in as an admin');
        }

        $admin = Auth::guard('admin')->user();
        
        $propertyStats = [
            'total_properties' => PropertyListing::count(),
            'pending_properties' => LandListing::where('admin_status', 'pending')->count(),
            'active_properties' => PropertyListing::where('status', 'active')->count(),
        ];

        $recentListings = LandListing::with('user')
            ->where('admin_status', 'pending')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'admin' => $admin,
            'propertyStats' => $propertyStats,
            'recentListings' => $recentListings
        ]);
    }

    public function getTotalProperties()
    {
        $properties = PropertyListing::with(['landListing.user'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/PropertyList', [
            'properties' => $properties,
            'listType' => 'total'
        ]);
    }

    public function getPendingProperties()
    {
        $pendingListings = LandListing::with(['user', 'images'])
            ->where('admin_status', 'pending')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/PropertyList', [
            'properties' => $pendingListings,
            'listType' => 'pending'
        ]);
    }

    public function getActiveProperties()
    {
        $activeProperties = PropertyListing::with(['landListing.user'])
            ->where('status', 'active')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/PropertyList', [
            'properties' => $activeProperties,
            'listType' => 'active'
        ]);
    }
}