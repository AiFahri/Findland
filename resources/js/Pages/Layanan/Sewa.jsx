import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Product from "../Product";
import datatanah from "../../Data/tanah.json";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const Sewa = () => {
    const locations = [
        "Semua Lokasi",
        ...new Set(
            datatanah
                .filter((item) => item.status === "Disewa")
                .map((item) => item.place.split(", ")[0])
        ),
    ];
    const [selectedLocation, setSelectedLocation] = useState("");
    const filteredData = datatanah.filter(
        (item) =>
            item.status === "Disewa" &&
            (selectedLocation === "" || item.place.startsWith(selectedLocation))
    );

    return (
        <div className="p-8">
            <Navbar />
            <Head title="Sewa Lahan" />
            <div className="mb-6">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <h1 className="text-4xl font-extrabold text-[#3E5245] mr-4 mt-4 flex items-center justify-center border w-auto p-3 bg-bunulrejo rounded-md ">
                        Tanah Disewa
                    </h1>

                    <select
                        value={selectedLocation}
                        onChange={(e) =>
                            setSelectedLocation(
                                e.target.value === "Semua Lokasi"
                                    ? ""
                                    : e.target.value
                            )
                        }
                        className="md:hidden w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {locations.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                    <div className="hidden md:flex items-center space-x-2">
                        <button
                            onClick={() => setSelectedLocation("")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                selectedLocation === ""
                                    ? "bg-bunulrejo text-lowokwaru"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            Semua Lokasi
                        </button>
                        {locations.slice(1).map((location) => (
                            <button
                                key={location}
                                onClick={() => setSelectedLocation(location)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    selectedLocation === location
                                        ? "bg-bunulrejo text-lowokwaru"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {location}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Product data={filteredData} />
            <Footer />
        </div>
    );
};

export default Sewa;
