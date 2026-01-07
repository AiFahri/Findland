<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Log image requests for debugging
        if (
            $request->is('storage/*') || 
            $request->is('assets/*') || 
            (strpos($request->path(), 'property') !== false && 
             preg_match('/\.(jpg|jpeg|png|gif)$/i', $request->path()))
        ) {
            Log::debug('Image request', [
                'path' => $request->path(),
                'full_url' => $request->fullUrl(),
                'method' => $request->method(),
                'ip' => $request->ip(),
                'user_agent' => $request->header('User-Agent')
            ]);
        }

        $response = $next($request);

        // Log 404 responses for images
        if (
            $response->getStatusCode() == 404 && 
            (
                $request->is('storage/*') || 
                $request->is('assets/*') || 
                preg_match('/\.(jpg|jpeg|png|gif)$/i', $request->path())
            )
        ) {
            Log::warning('Image not found (404)', [
                'path' => $request->path(),
                'full_url' => $request->fullUrl(),
                'method' => $request->method()
            ]);
        }

        return $response;
    }
}
