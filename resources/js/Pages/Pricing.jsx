import { useState } from "react";
import { Link } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const packages = [
    { id: 1, name: "Starter", price: 334000, duration: "1 Bulan" },
    { id: 2, name: "Enterprise", price: 1000000, duration: "3 Bulan" },
    { id: 3, name: "Lite", price: 1900000, duration: "6 Bulan", popular: true },
    { id: 4, name: "Pro", price: 3800000, duration: "12 Bulan" },
];

const Pricing = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);

    return (
        <div className="p-8">
            <Navbar />
            <div className="p-8 bg-white border rounded-2xl shadow-md mt-8 mb-8">
                <h2 className="text-5xl font-bold text-pandanwangi mb-10 text-left ">
                    We provide the
                    <h2>land for future Property.</h2>
                </h2>

                <div className="grid md:grid-cols-4 gap-6">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`p-6 border rounded-2xl text-left transition-all duration-300 ${
                                selectedPackage === pkg.id
                                    ? "bg-pandanwangi text-white"
                                    : "bg-white text-gray-900"
                            }`}
                            onClick={() => setSelectedPackage(pkg.id)}
                        >
                            <p className="text-2xl font-semibold">
                                Rp {pkg.price.toLocaleString()}
                            </p>
                            <h3 className="text-xl font-bold">{pkg.name}</h3>
                            <p className="text-sm text-lowokwaru">
                                For most bussiness want that want to optimize
                                web queries
                            </p>
                            <br />
                            <p className="text-sm text-lowokwaru">
                                Peningkatan Visibilitas
                            </p>
                            <p className="text-sm text-lowokwaru">
                                Menjangkau banyak pengguna
                            </p>
                            <p className="text-sm text-lowokwaru">
                                Laporan analisis
                            </p>
                            <p className="text-sm text-lowokwaru">
                                Durasi posting {pkg.duration}
                            </p>
                            {pkg.popular && (
                                <button className="bg-green-700 text-white text-xs px-3 py-1 rounded-full absolute top-64 right-16">
                                    MOST POPULAR
                                </button>
                            )}

                            <div className="mt-8 text-center">
                                <Link
                                    href={route("land.create", {
                                        package: selectedPackage,
                                    })}
                                    className={`mt-4 w-full px-4 py-2 rounded-lg border transition ${
                                        selectedPackage 
                                            ? "bg-bunulrejo text-white hover:bg-opacity-90" 
                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    }`}
                                    disabled={!selectedPackage}
                                >
                                    Choose plan
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};
export default Pricing;