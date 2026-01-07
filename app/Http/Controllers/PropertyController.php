public function index(Request $request)
{
    $cacheKey = 'properties_' . md5(json_encode($request->all()));
    
    return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($request) {
        $query = LandListing::query();
        
        // Apply filters
        if ($request->has('location')) {
            $query->where('city', 'like', '%' . $request->location . '%')
                  ->orWhere('province', 'like', '%' . $request->location . '%');
        }
        
        if ($request->has('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }
        
        if ($request->has('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }
        
        return $query->with('images')->paginate(12);
    });
}