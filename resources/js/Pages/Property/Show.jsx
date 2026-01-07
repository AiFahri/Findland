import { Head } from "@inertiajs/react";

export default function Show({ property }) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: property.title,
        description: property.description,
        image: property.images[0]?.url || "",
        address: {
            "@type": "PostalAddress",
            addressLocality: property.city,
            addressRegion: property.province,
            postalCode: property.postal_code,
            addressCountry: "ID",
        },
        offers: {
            "@type": "Offer",
            price: property.price,
            priceCurrency: "IDR",
        },
    };

    return (
        <>
            <Head>
                <title>{property.title} | FindLand</title>
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Head>
        </>
    );
}
