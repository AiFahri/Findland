import React, { useState, useMemo, useRef, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import Product from "../Product";
import MainLayout from "@/Layouts/MainLayout";
import SearchBar from "@/Components/SearchBar";
import PropertiHeaderSkeleton from "@/Components/common/PropertiHeaderSkeleton";
import ProductSkeleton from "@/Components/common/ProductSkeleton";
import SelectedProductSkeleton from "@/Components/common/SelectedProductSkeleton";

const Properti = ({ properties, status, selectedProperty }) => {
    const { data, links, current_page, last_page } = properties;
    const propertiContainerRef = useRef(null);
    const productRef = useRef(null);
    const { search } = usePage().props;
    const [searchQuery, setSearchQuery] = useState(search || "");
    const [loading, setLoading] = useState(true);

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
        const filtered = data.filter((item) => {
            const statusMatch = item.status === status;
            const locationMatch =
                selectedLocation === "Semua Lokasi" ||
                item.place.split(", ")[0] === selectedLocation;

            return statusMatch && locationMatch;
        });       
        return filtered;
    }, [data, status, selectedLocation]);

    useEffect(() => {
        if (propertiContainerRef.current) {
            propertiContainerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [current_page]);

    useEffect(() => {
        if (selectedProperty) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [selectedProperty]);

    useEffect(() => {
                const preloadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => reject();
                img.src = src;
            });
        };

        const propertyImages = [];
        if (data && data.length > 0) {
            data.forEach((property) => {
                if (property.image) {
                    propertyImages.push(
                        preloadImage(`/storage/${property.image}`)
                    );
                }
            });
        }

        const minDelay = new Promise((resolve) => setTimeout(resolve, 1000));

        Promise.all([...propertyImages, minDelay])
            .then(() => {
                setLoading(false);
            })
            .catch(() => {
                setTimeout(() => setLoading(false), 1500);
            });

        return () => {
            // Cleanup
        };
    }, [data]);
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

            <div className="relative">
                {loading && (
                    <div className="transition-opacity duration-500 opacity-100">
                        <PropertiHeaderSkeleton />
                    </div>
                )}
                <div
                    className={`transition-opacity duration-500 ${
                        loading ? "opacity-0" : "opacity-100"
                    }`}
                >
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                        <h1 className="text-4xl font-extrabold text-[#3E5245] mr-4 mt-4 flex items-center justify-center border w-auto p-3 bg-bunulrejo rounded-md">
                            {status === "Dijual" ? "Beli" : "Sewa"} Lahan
                        </h1>

                        {search && (
                            <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700 flex items-center">
                                <span className="mr-2">
                                    Hasil pencarian untuk:
                                </span>
                                <span className="font-semibold">
                                    "{search}"
                                </span>
                                <Link
                                    href={`/layanan/${
                                        status === "Dijual" ? "beli" : "sewa"
                                    }`}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        )}
                        <div className="w-full md:hidden">
                            <div
                                onClick={() =>
                                    setIsLocationDropdownOpen(
                                        !isLocationDropdownOpen
                                    )
                                }
                                className="w-full p-2 border rounded-md flex justify-between items-center cursor-pointer"
                            >
                                <span>{selectedLocation}</span>
                                <svg
                                    className={`w-5 h-5 transform transition-transform ${
                                        isLocationDropdownOpen
                                            ? "rotate-180"
                                            : ""
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
                                    onClick={() =>
                                        handleLocationSelect(location)
                                    }
                                >
                                    {location}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative mt-4">
                {loading && (
                    <div className="transition-opacity duration-500 opacity-100">
                        <ProductSkeleton
                            hasSelectedProperty={!!selectedProperty}
                        />
                    </div>
                )}

                <div
                    className={`transition-opacity duration-500 ${
                        loading ? "opacity-0" : "opacity-100"
                    }`}
                >
                    {filteredData.length > 0 ? (
                        <>
                            {search && (
                                <div className="mt-4 mb-2 text-gray-600">
                                    Ditemukan {filteredData.length} properti
                                    untuk pencarian "{search}"
                                </div>
                            )}
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
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="mt-4 text-lg font-medium text-gray-600">
                                Tidak ada properti yang tersedia untuk {status === "Dijual" ? "dijual" : "disewa"}
                            </p>
                            <p className="mt-2 text-gray-500">
                                Silakan coba filter lokasi lain atau kembali lagi nanti
                            </p>
                            <Link
                                href="/"
                                className="mt-6 inline-block px-6 py-2 bg-bunulrejo text-lowokwaru rounded-lg hover:bg-opacity-90 transition"
                            >
                                Kembali ke Beranda
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
Properti.layout = (page) => <MainLayout children={page} />;

export default Properti;


