<?php
namespace App\Http\Controllers;

use App\Models\PropertyListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PropertyListingController extends Controller
{
    public function index(Request $request)
    {
        $status             = $request->input('status', $request->route('status'));
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
        Log::info('Selected Property ID: ' . $selectedPropertyId);
        Log::info('Selected Property: ', $selectedProperty ? [$selectedProperty->toArray()] : ['null']);
        Log::info('Properties data: ', $properties->items());

        return Inertia::render('Layanan/Properti', [
            'properties'       => $properties,
            'status'           => $status,
            'selectedProperty' => $selectedProperty,
        ]);
    }

    public function getHomeProperties()
    {
        // Log authentication status
        Log::info('Home page accessed', [
            'auth_check'   => auth()->check(),
            'auth_id'      => auth()->id(),
            'session_id'   => session()->getId(),
            'session_data' => session()->all(),
        ]);

        $latestProperties = PropertyListing::latest()
            ->take(6)
            ->get();

        $featuredProperties = PropertyListing::where('featured', true)
            ->take(3)
            ->get();

        return Inertia::render('Home', [
            'latestProperties'   => $latestProperties,
            'featuredProperties' => $featuredProperties,
            'auth'               => [
                'user'  => auth()->user(),
                'check' => auth()->check(),
                'id'    => auth()->id(),
            ],
            'debug'              => [
                'session_id'      => session()->getId(),
                'auth_debug'      => session('auth_debug'),
                'success_message' => session('success'),
            ],
        ]);
    }

    public function show($id)
    {
        $property = PropertyListing::findOrFail($id);
        return Inertia::render('Layanan/PropertyDetail', [
            'property' => $property,
        ]);
    }
}
