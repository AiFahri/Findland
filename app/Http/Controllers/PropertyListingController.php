<?php

namespace App\Http\Controllers;

use App\Models\PropertyListing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PropertyListingController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status', $request->route('status'));
        $selectedPropertyId = $request->input('selectedPropertyId');
        
        Log::info('Incoming status: ' . $status);
        
        $query = PropertyListing::query();
    
        if ($status === 'Dijual') {
            $query->where('status', 'Dijual');
        } elseif ($status === 'Disewa') {
            $query->where('status', 'Disewa');
        }
    
        $properties = $query->paginate(10);

        // If a specific property is selected, pass it to the view
        $selectedProperty = $selectedPropertyId 
            ? PropertyListing::find($selectedPropertyId) 
            : null;

        Log::info('Properties count: ' . $properties->count());
        Log::info('Properties data: ', $properties->items());

        return Inertia::render('Layanan/Properti', [
            'properties' => $properties,
            'status' => $status,
            'selectedProperty' => $selectedProperty
        ]);
    }

    public function getHomeProperties()
    {
        $latestProperties = PropertyListing::latest()
            ->take(6)
            ->get();

        $featuredProperties = PropertyListing::where('featured', true)
            ->take(3)
            ->get();

        return Inertia::render('Home', [
            'latestProperties' => $latestProperties,
            'featuredProperties' => $featuredProperties,
        ]);
    }

    public function show($id)
    {
        $property = PropertyListing::findOrFail($id);
        return Inertia::render('Layanan/PropertyDetail', [
            'property' => $property
        ]);
    }
}