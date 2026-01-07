import { useState, useEffect, useMemo, useCallback } from "react";

export const useProductDisplay = (data, initialSelectedProperty) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const propertyData = useMemo(
        () => (Array.isArray(data) ? data : []),
        [data]
    );

    const getPropertyImages = useCallback((product) => {
        if (!product) {
            return [];
        }
        // Jika product.image ada, gunakan sebagai gambar pertama
        const mainImage = product.image ? `/storage/${product.image}` : null;
        // Jika product.images adalah array, gunakan sebagai gambar tambahan
        let additionalImages = [];
        if (Array.isArray(product.images)) {
            additionalImages = product.images.map((img) => `/storage/${img}`);
        } else if (typeof product.images === "string") {
            try {
                const parsedImages = JSON.parse(
                    product.images.replace(/\\/g, "").replace(/^"|"$/g, "")
                );
                if (Array.isArray(parsedImages)) {
                    additionalImages = parsedImages.map(
                        (img) => `/storage/${img}`
                    );
                }
            } catch (error) {
                console.error("Error parsing product.images:", error);
            }
        }

        const allImages = mainImage
            ? [mainImage, ...additionalImages]
            : additionalImages;

        // Jika tidak ada gambar, coba gunakan pendekatan lama
        if (allImages.length === 0) {
            // Buat nama file berdasarkan konvensi penamaan
            const title =
                product.title?.replace(/\s+/g, "").toUpperCase() || "PROPERTY";
            const landListingId = product.land_listing_id;

            // Buat array path untuk 4 gambar (index 1-4)
            const propertyImages = [];

            // Cek ekstensi file yang ada untuk setiap indeks
            for (let i = 1; i <= 4; i++) {
                const basePath = `property_${landListingId}_${title}_${i}`;
                propertyImages.push(`/storage/property/${basePath}.png`);
            }

            return propertyImages;
        }
        return allImages;
    }, []);

    // Fungsi untuk mendapatkan thumbnail image (gambar utama) dari property
    const getPropertyThumbnail = useCallback((product) => {
        if (!product) {
            return "/assets/default-property.jpg";
        }

        // Jika product.image ada, gunakan sebagai thumbnail
        if (product.image) {
            // Jika path sudah lengkap dengan /storage/, gunakan langsung
            if (product.image.startsWith("/storage/")) {
                return product.image;
            }
            // Jika tidak, tambahkan /storage/ di depan
            return `/storage/${product.image}`;
        }

        // Jika tidak ada image, coba gunakan pendekatan lama
        if (product.land_listing_id) {
            // Buat nama file berdasarkan konvensi penamaan
            const title =
                product.title?.replace(/\s+/g, "").toUpperCase() || "PROPERTY";
            const landListingId = product.land_listing_id;
            const basePath = `property_${landListingId}_${title}_1`;
            // Prioritaskan format PNG
            return `/storage/property/${basePath}.png`;
        }
        // Fallback ke default image
        return "/assets/default-property.jpg";
    }, []);
    const resetSelectedProduct = useCallback(() => {
        setSelectedProduct(null);
        setCurrentImageIndex(0);
    }, []);

    useEffect(() => {
        if (initialSelectedProperty) {
            // Coba cari properti yang cocok berdasarkan ID
            const matchedProperty = propertyData.find(
                (property) => property.id === initialSelectedProperty.id
            );

            if (matchedProperty) {
                setSelectedProduct(matchedProperty);

                // Scroll ke bagian atas komponen
                const productContainer =
                    document.getElementById("product-container");
                if (productContainer) {
                    productContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            } else if (propertyData.length > 0) {
                // Jika tidak ada properti yang cocok tetapi ada data properti,
                // gunakan properti pertama sebagai fallback
                setSelectedProduct(propertyData[0]);
            }
        }
    }, [initialSelectedProperty, propertyData]);

    // useEffect(() => {
    //     if (!selectedProduct && propertyData.length > 0) {
    //         resetSelectedProduct();
    //     }
    // }, [propertyData, resetSelectedProduct]);

    const handleProductSelect = useCallback((product) => {
        setSelectedProduct(product);
        setCurrentImageIndex(0);
    }, []);

    return {
        selectedProduct,
        currentImageIndex,
        propertyData,
        setCurrentImageIndex,
        getPropertyImages,
        getPropertyThumbnail,
        handleProductSelect,
        resetSelectedProduct,
    };
};
