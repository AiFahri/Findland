import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Product from "../Product";
import datatanah from "../../Data/tanah.json";

const Properti = ({ status, selectedProperty }) => {
    const locations = [
        "Semua Lokasi",
        ...new Set(
            datatanah
                .filter((item) => item.status === status)
                .map((item) => item.place.split(", ")[0])
        ),
    ];

    const [selectedLocation, setSelectedLocation] = useState("");

    const filteredData = datatanah.filter(
        (item) =>
            item.status === status &&
            (selectedLocation === "" ||
                selectedLocation === "Semua Lokasi" ||
                item.place.split(", ")[0] === selectedLocation)
    );

    return (
        <div className="p-8">
            <Navbar />
            <Head
                title={status === "Dijual" ? "Beli Properti" : "Sewa Properti"}
            />

            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <h1 className="text-4xl font-extrabold text-[#3E5245] mr-4 mt-4 flex items-center justify-center border w-auto p-3  bg-bunulrejo rounded-md ">
                    {status === "Dijual" ? "Beli" : "Sewa"} Lahan
                </h1>
                <div className="flex flex-wrap gap-2">
                    {locations.map((location, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                selectedLocation === location
                                    ? "bg-bunulrejo text-lowokwaru"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => setSelectedLocation(location)}
                        >
                            {location}
                        </button>
                    ))}
                </div>
            </div>

            <Product data={filteredData} selectedProperty={selectedProperty} />
            <Footer />
        </div>
    );
};

export default Properti;
