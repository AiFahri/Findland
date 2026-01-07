import { useState, useCallback } from "react";
import { formatRupiah, truncateText } from "@/Utils/formatter";

export const useProperty = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fungsi untuk mendapatkan path gambar yang benar dari property
    const getPropertyImagePath = useCallback((property) => {
        if (!property || !property.land_listing_id) {
            // Jika tidak ada land_listing_id, gunakan image langsung
            return property?.image || "/assets/default-property.jpg";
        }

        // Buat nama file berdasarkan konvensi penamaan
        const title =
            property.title?.replace(/\s+/g, "").toUpperCase() || "PROPERTY";
        const landListingId = property.land_listing_id;
        const basePath = `property_${landListingId}_${title}_1`;
        // Prioritaskan format PNG
        return `/storage/property/${basePath}.png`;
    }, []);

    const formatPropertyData = useCallback(
        (property) => {
            const imagePath = getPropertyImagePath(property);

            return {
                ...property,
                formattedPrice: formatRupiah(property.price),
                shortDescription: truncateText(property.description, 50),
                image: imagePath,
            };
        },
        [getPropertyImagePath]
    );

    const formatPropertiesList = useCallback(
        (propertiesList) => {
            return propertiesList.map(formatPropertyData);
        },
        [formatPropertyData]
    );

    return {
        properties,
        loading,
        error,
        formatPropertyData,
        formatPropertiesList,
        getPropertyImagePath,
    };
};
