import { useState } from "react";
import { Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import checklist from "../../assets/checklist.svg";
import checklistWhite from "../../assets/checklist-white.svg";
import { formatRupiah, truncateText } from "@/Utils/formatter";

const packages = [
    { id: 1, name: "Starter", price: 334000, duration: "1 Bulan" },
    { id: 2, name: "Enterprise", price: 1000000, duration: "3 Bulan" },
    { id: 3, name: "Lite", price: 1900000, duration: "6 Bulan", popular: true },
    { id: 4, name: "Pro", price: 3800000, duration: "12 Bulan" },
];

const Pricing = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);

    return (
        <>
            <div className="p-4 md:p-8 bg-white border rounded-2xl shadow-md mt-8 mb-8 pb-20">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-pandanwangi mb-6 md:mb-10 text-left">
                    We provide the
                    <span className="block">land for future Property.</span>
                </h2>

                <div className="grid md:grid-cols-4 gap-6">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`relative p-6 pt-12 border rounded-2xl shadow-xl text-left transition-all duration-300 ${
                                selectedPackage === pkg.id
                                    ? "bg-pandanwangi text-white"
                                    : "bg-white text-lowokwaru"
                            }`}
                            onClick={() => setSelectedPackage(pkg.id)}
                        >
                            {pkg.popular && (
                                <div className="absolute top-3 right-4 bg-lowokwaru text-bunulrejo text-xs px-4 py-1 rounded-full">
                                    MOST POPULAR
                                </div>
                            )}
                            <p className="text-3xl font-semibold mb-4 text-lowokwaru">
                                {formatRupiah(pkg.price)}
                            </p>
                            <h3 className="text-xl font-bold">{pkg.name}</h3>
                            <p className="text-sm ">
                                For most bussiness want that want to optimize
                                web queries
                            </p>
                            <br />
                            <ul className="text-sm space-y-3">
                                {[
                                    'Peningkatan Visibilitas', 
                                    'Menjangkau banyak pengguna', 
                                    'Laporan analisis',
                                    `Durasi posting ${pkg.duration}`
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <div className="relative w-6 h-6 flex items-center justify-center">
                                            <div className={`absolute border w-5 h-5 rounded-full ${
                                                selectedPackage === pkg.id
                                                    ? "bg-white opacity-10 border-white"
                                                    : "bg-pandanwangi border-pandanwangi"
                                            }`} />
                                            <img
                                                src={selectedPackage === pkg.id ? checklistWhite : checklist}
                                                className="w-3 h-3 z-10"
                                                alt="Checklist"
                                            />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-12 text-center">
                                <Link
                                    href={route("land.create", {
                                        package: pkg.id
                                    })}
                                    className={`mt-6 w-full px-4 md:px-12 py-2 md:py-3 text-sm md:text-base rounded-3xl border transition ${
                                        selectedPackage === pkg.id
                                            ? "bg-bunulrejo text-lowokwaru hover:bg-opacity-90"
                                            : "bg-gray-200 text-lowokwaru cursor-not-allowed"
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
        </>
    );
};
Pricing.layout = (page) => <MainLayout children={page} />;

export default Pricing;
