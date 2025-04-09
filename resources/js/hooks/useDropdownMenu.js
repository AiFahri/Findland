import { useState, useRef, useEffect } from "react";

export const useDropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Jika klik pada button, jangan lakukan apa-apa (toggle akan menangani)
            if (buttonRef.current && buttonRef.current.contains(event.target)) {
                return;
            }

            // Jika klik di luar dropdown, tutup dropdown
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                closeDropdown();
            }
        };

        // Tambahkan event listener jika dropdown terbuka
        if (isOpen && !isClosing) {
            // Gunakan setTimeout untuk menghindari konflik dengan event click yang membuka dropdown
            setTimeout(() => {
                document.addEventListener("click", handleClickOutside);
            }, 10);
        }

        // Cleanup function
        return () => {
            document.removeEventListener("click", handleClickOutside);
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
        closeDropdown,
        isClosing,
    };
};
