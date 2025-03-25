import React, { useState, useMemo, useRef, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import Product from "../Product";
import MainLayout from "@/Layouts/MainLayout";

const Properti = ({ properties, status, selectedProperty }) => {
    const { data, links, current_page, last_page } = properties;
    const propertiContainerRef = useRef(null);
    const productRef = useRef(null);
    const locations = useMemo(() => {
        const allLocations = [
            "Semua Lokasi",
            ...new Set(
                data
                    .filter((item) => item.status === status)
                    .map((item) => item.place.split(", ")[0])
            ),
        ];
        return allLocations;
    }, [data, status]);

    const [selectedLocation, setSelectedLocation] = useState("Semua Lokasi");
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const statusMatch = item.status === status;
            const locationMatch =
                selectedLocation === "Semua Lokasi" ||
                item.place.split(", ")[0] === selectedLocation;

            return statusMatch && locationMatch;
        });
    }, [data, status, selectedLocation]);

    useEffect(() => {
        if (propertiContainerRef.current) {
            propertiContainerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [current_page]);
    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setIsLocationDropdownOpen(false);

        if (productRef.current) {
            productRef.current.resetSelectedProduct();
        }
    };

    return (
        <div ref={propertiContainerRef}>
            <Head
                title={status === "Dijual" ? "Beli Properti" : "Sewa Properti"}
            />

            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <h1 className="text-4xl font-extrabold text-[#3E5245] mr-4 mt-4 flex items-center justify-center border w-auto p-3 bg-bunulrejo rounded-md">
                    {status === "Dijual" ? "Beli" : "Sewa"} Lahan
                </h1>
                <div className="w-full md:hidden">
                    <div
                        onClick={() =>
                            setIsLocationDropdownOpen(!isLocationDropdownOpen)
                        }
                        className="w-full p-2 border rounded-md flex justify-between items-center cursor-pointer"
                    >
                        <span>{selectedLocation}</span>
                        <svg
                            className={`w-5 h-5 transform transition-transform ${
                                isLocationDropdownOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                    {isLocationDropdownOpen && (
                        <div className="absolute z-10 w-[calc(100%-4rem)] bg-white border rounded-md shadow-lg mt-1">
                            {locations.map((location, index) => (
                                <div
                                    key={index}
                                    onClick={() =>
                                        handleLocationSelect(location)
                                    }
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {location}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="hidden md:flex flex-wrap gap-2">
                    {locations.map((location, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                selectedLocation === location
                                    ? "bg-bunulrejo text-lowokwaru"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => handleLocationSelect(location)}
                        >
                            {location}
                        </button>
                    ))}
                </div>
            </div>

            {filteredData.length > 0 ? (
                <>
                    <Product
                        ref={productRef}
                        data={filteredData}
                        initialSelectedProperty={selectedProperty}
                    />

                    {last_page > 1 && (
                        <div className="flex justify-center mt-8 space-x-2 mb-6">
                            {links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-4 py-2 rounded ${
                                        link.active
                                            ? "bg-bunulrejo text-lowokwaru"
                                            : "bg-gray-200 text-gray-700"
                                    } ${
                                        link.url === null
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-bunulrejo/80"
                                    }`}
                                    preserveState
                                    preserveScroll
                                    disabled={link.url === null}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    Tidak ada properti yang tersedia untuk{" "}
                    {status === "Dijual" ? "dijual" : "disewa"}
                </div>
            )}
        </div>
    );
};
Properti.layout = (page) => <MainLayout children={page} />;

export default Properti;
