import React, { useEffect, useRef } from "react";

const SearchBar = ({
    value,
    onChange,
    onEnter,
    placeholder = "Cari",
    className = "",
}) => {
    const inputRef = useRef(null);

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

    return (
        <div className={`flex items-center w-full md:w-auto ${className}`}>
            <input
                ref={inputRef}
                type="text"
                className="w-full md:w-56 outline-none rounded-3xl bg-[#153832] text-white px-4 py-2"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onKeyPress={(e) => {
                    if (e.key === "Enter" && onEnter) {
                        onEnter();
                    }
                }}
            />
        </div>
    );
};

export default SearchBar;
