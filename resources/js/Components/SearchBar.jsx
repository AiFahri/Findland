import React, { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";

const SearchBar = ({
    value: propValue,
    onChange: propOnChange,
    onEnter: propOnEnter,
    placeholder = "Cari properti...",
    className = "",
}) => {
    const inputRef = useRef(null);
    const [searchValue, setSearchValue] = useState(propValue || "");

    useEffect(() => {
        if (propValue !== undefined) {
            setSearchValue(propValue);
        }
    }, [propValue]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Windows: Ctrl + F, Mac: Cmd + K
            if ((e.ctrlKey && e.key === "f") || (e.metaKey && e.key === "k")) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setSearchValue(newValue);

        if (propOnChange) {
            propOnChange(e);
        }
    };

    const handleSearch = () => {
        if (searchValue.trim()) {
            router.get("/layanan/beli", { search: searchValue });
        }

        if (propOnEnter) {
            propOnEnter(searchValue);
        }
    };

    return (
        <div className={`flex items-center w-full ${className}`}>
            <input
                ref={inputRef}
                type="text"
                className="w-full lg:max-w-80 outline-none rounded-3xl bg-[#153832] text-white px-4 py-2"
                value={searchValue}
                onChange={handleChange}
                placeholder={placeholder}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch();
                    }
                }}
            />
            <button
                onClick={handleSearch}
                className="-ml-10 text-white hover:text-bunulrejo focus:outline-none"
                aria-label="Search"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </button>
        </div>
    );
};

export default SearchBar;
