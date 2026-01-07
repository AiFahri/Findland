<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        // Izinkan Midtrans dan Google
        $cspDirectives = [
            "default-src" => "'self'",
            "script-src" => "'self' 'unsafe-inline' 'unsafe-eval' https://app.midtrans.com https://app.sandbox.midtrans.com https://api.midtrans.com https://api.sandbox.midtrans.com https://accounts.google.com https://www.googletagmanager.com",
            "style-src" => "'self' 'unsafe-inline' https://accounts.google.com",
            "img-src" => "'self' data: https: https://accounts.google.com",
            "font-src" => "'self'",
            "connect-src" => "'self' https://app.midtrans.com https://app.sandbox.midtrans.com https://api.midtrans.com https://api.sandbox.midtrans.com https://accounts.google.com",
            "frame-src" => "'self' https://app.midtrans.com https://app.sandbox.midtrans.com https://api.midtrans.com https://api.sandbox.midtrans.com https://accounts.google.com",
            "object-src" => "'none'",
            "base-uri" => "'self'",
            "form-action" => "'self' https://accounts.google.com",
        ];
        
        // Gabungkan semua directive CSP
        $cspHeader = '';
        foreach ($cspDirectives as $directive => $value) {
            $cspHeader .= "$directive $value; ";
        }
        
        $response->headers->set('Content-Security-Policy', trim($cspHeader));
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // Izinkan Clipboard API untuk Midtrans
        $response->headers->set('Permissions-Policy', 'clipboard-write=(self "https://app.midtrans.com" "https://app.sandbox.midtrans.com"), clipboard-read=(self "https://app.midtrans.com" "https://app.sandbox.midtrans.com")');
        
        return $response;
    }
}

