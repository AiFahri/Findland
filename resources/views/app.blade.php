<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="permissions-policy" content="clipboard-write=self">
        <meta http-equiv="Permissions-Policy" content="clipboard-write=*">
        <meta name="description" content="{{ config('app.description', 'Platform pencarian properti terbaik di Indonesia. Temukan tanah, rumah, dan properti impian Anda dengan mudah.') }}">
        <meta name="keywords" content="properti, tanah, rumah, jual beli properti, sewa properti, Indonesia">
        <meta name="author" content="FindLand">
        <meta name="robots" content="index, follow">
        <meta name="googlebot" content="index, follow">
        
        <link rel="canonical" href="{{ url()->current() }}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="{{ config('app.name', 'Findland') }}">
        <meta property="og:description" content="{{ config('app.description', 'Platform pencarian properti terbaik di Indonesia') }}">
        <meta property="og:image" content="{{ asset('assets/og-image.jpg') }}">
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ url()->current() }}">
        <meta property="twitter:title" content="{{ config('app.name', 'Findland') }}">
        <meta property="twitter:description" content="{{ config('app.description', 'Platform pencarian properti terbaik di Indonesia') }}">
        <meta property="twitter:image" content="{{ asset('assets/og-image.jpg') }}">

        <title inertia>{{ config('app.name', 'Findland') }}</title>
        <link rel="icon" type="image/svg+xml" href="/assets/findland_white.svg">
        
        <link rel="preload" href="/assets/findland_white.svg" as="image" type="image/svg+xml">
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sonsie+One&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Sonsie+One&family=Satoshi:wght@300;400;500;700&display=swap" rel="stylesheet">

        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FindLand",
            "url": "{{ url('/') }}",
            "logo": "{{ asset('assets/findland_white.svg') }}",
            "sameAs": [
                "https://instagram.com/findland",
            ]
        }
        </script>

        <meta name="midtrans-url" content="{{ config('midtrans.is_production') ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com' }}">
        <meta name="midtrans-client-key" content="{{ config('midtrans.client_key') }}">
        <meta http-equiv="Permissions-Policy" content="clipboard-write=(self 'https://app.midtrans.com' 'https://app.sandbox.midtrans.com'), clipboard-read=(self 'https://app.midtrans.com' 'https://app.sandbox.midtrans.com')">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>




