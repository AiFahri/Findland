import { useState, useRef, useEffect } from 'react';

export const useDropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const clickTimeoutRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (buttonRef.current && buttonRef.current.contains(event.target)) {
                return;
            }
            
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };

        if (isOpen && !isClosing) {
            clickTimeoutRef.current = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 200);
        }

        return () => {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current);
            }
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, isClosing]);

    const closeDropdown = () => {
        setIsClosing(true);
        setIsOpen(false);
        
        setTimeout(() => {
            setIsClosing(false);
        }, 300);
    };

    const toggle = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (isOpen && !isClosing) {
            closeDropdown();
        } else if (!isOpen && !isClosing) {
            setIsOpen(true);
        }
    };

    return {
        isOpen,
        dropdownRef,
        buttonRef,
        toggle,
        isClosing
    };
};







