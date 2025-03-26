import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export const useAuth = () => {
    const { auth } = usePage().props;
    const [user, setUser] = useState(auth?.user);
    const [isAuthenticated, setIsAuthenticated] = useState(!!auth?.user);

    useEffect(() => {
        setUser(auth?.user);
        setIsAuthenticated(!!auth?.user);
    }, [auth?.user]);

    return {
        user,
        isAuthenticated,
    };
};