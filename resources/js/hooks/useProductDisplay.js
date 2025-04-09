import { useState, useEffect, useMemo, useCallback } from 'react';

export const useProductDisplay = (data, initialSelectedProperty) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const propertyData = useMemo(
        () => (Array.isArray(data) ? data : []),
        [data]
    );

    const normalizeImages = useCallback((product) => {
        if (!product) return [];

        const normalizePath = (image) => {
            if (!image) return null;
            
            const cleanImage = image.replace(/^"|"$/g, '').replace(/\\/g, '');
            
            if (cleanImage.startsWith('http://') || cleanImage.startsWith('https://')) {
                return cleanImage;
            }
            
            if (cleanImage.startsWith('/storage/')) {
                return cleanImage;
            }
            
            if (cleanImage.startsWith('/assets/')) {
                const assetName = cleanImage.split('/assets/')[1];
                return [
                    cleanImage,                    // /assets/tanah1.jpg
                    `/storage/assets/${assetName}`, // /storage/assets/tanah1.jpg
                    `/storage/${assetName}`,       // /storage/tanah1.jpg
                ];
            }
            
            const cleanPath = cleanImage.replace(/^\/+/, '');
            return [
                `/assets/${cleanPath}`,
                `/storage/${cleanPath}`,
                `/storage/assets/${cleanPath}`,
            ];
        };

        let images = [];

        try {
            if (product.images && typeof product.images === 'string') {
                const parsedImages = JSON.parse(
                    product.images.replace(/\\/g, '').replace(/^"|"$/g, '')
                );
                images = parsedImages
                    .flatMap(normalizePath)
                    .filter(Boolean);
            }
            else if (Array.isArray(product.images)) {
                images = product.images
                    .flatMap(normalizePath)
                    .filter(Boolean);
            }
            else if (product.land_listing && Array.isArray(product.land_listing.images)) {
                images = product.land_listing.images
                    .flatMap(normalizePath)
                    .filter(Boolean);
            }

            if (!images.length && product.image) {
                const singleImage = normalizePath(product.image);
                if (Array.isArray(singleImage)) {
                    images.push(...singleImage);
                } else if (singleImage) {
                    images.push(singleImage);
                }
            }

            if (!images.length) {
                images.push('/assets/default-property.jpg');
            }

            return images;
        } catch (error) {
            console.error('Error processing images:', error);
            return ['/assets/default-property.jpg'];
        }
    }, []);

    const resetSelectedProduct = useCallback(() => {
        setSelectedProduct(null);
        setCurrentImageIndex(0);
    }, []);

    useEffect(() => {
        if (initialSelectedProperty) {
            const matchedProperty = propertyData.find(
                (property) => property.id === initialSelectedProperty.id
            );

            if (matchedProperty) {
                setSelectedProduct(matchedProperty);
            }
        }
    }, [initialSelectedProperty, propertyData]);

    useEffect(() => {
        if (!selectedProduct && propertyData.length > 0) {
            resetSelectedProduct();
        }
    }, [propertyData, resetSelectedProduct]);

    const handleProductSelect = useCallback((product) => {
        setSelectedProduct(product);
        setCurrentImageIndex(0);
    }, []);

    return {
        selectedProduct,
        currentImageIndex,
        propertyData,
        setCurrentImageIndex,
        normalizeImages,
        handleProductSelect,
        resetSelectedProduct
    };
};


