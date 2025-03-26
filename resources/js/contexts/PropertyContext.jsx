import React, { createContext, useContext, useReducer } from 'react';

const PropertyContext = createContext();

const initialState = {
    latestProperties: [],
    featuredProperties: [],
    loading: false,
    error: null
};

const propertyReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LATEST_PROPERTIES':
            return { ...state, latestProperties: action.payload };
        case 'SET_FEATURED_PROPERTIES':
            return { ...state, featuredProperties: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export const PropertyProvider = ({ children }) => {
    const [state, dispatch] = useReducer(propertyReducer, initialState);

    return (
        <PropertyContext.Provider value={{ state, dispatch }}>
            {children}
        </PropertyContext.Provider>
    );
};

export const usePropertyContext = () => {
    const context = useContext(PropertyContext);
    if (!context) {
        throw new Error('usePropertyContext must be used within a PropertyProvider');
    }
    return context;
};