import { useState, useCallback } from 'react';
import { formatRupiah, truncateText } from '@/Utils/formatter';

export const useProperty = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatPropertyData = useCallback((property) => ({
        ...property,
        formattedPrice: formatRupiah(property.price),
        shortDescription: truncateText(property.description, 50)
    }), []);

    const formatPropertiesList = useCallback((propertiesList) => {
        return propertiesList.map(formatPropertyData);
    }, [formatPropertyData]);

    return {
        properties,
        loading,
        error,
        formatPropertyData,
        formatPropertiesList
    };
};