<?php

namespace App\Http\Controllers;

use App\Models\PropertyListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyListingController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status', $request->route('status'));
        $selectedPropertyId = $request->input('selectedPropertyId');
        $search = trim((string) $request->input('search', ''));

        $query = PropertyListing::query();

        if ($status === 'Dijual') {
            $query->where('status', 'Dijual');
        } elseif ($status === 'Disewa') {
            $query->where('status', 'Disewa');
        }

        $query->when($search !== '', function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('place', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        });

        $properties = $query->paginate(10)->withQueryString();

        // If a specific property is selected, pass it to the view
        $selectedProperty = $selectedPropertyId
        ? PropertyListing::find($selectedPropertyId)
        : null;

        return Inertia::render('Layanan/Properti', [
            'properties' => $properties,
            'status' => $status,
            'search' => $search,
            'selectedProperty' => $selectedProperty,
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
            'auth' => [
                'user' => auth()->user(),
                'check' => auth()->check(),
                'id' => auth()->id(),
            ],
        ]);
    }

    public function show($id)
    {
        $property = PropertyListing::findOrFail($id);

        return Inertia::render('Property/Show', [
            'property' => $property,
        ]);
    }
}
