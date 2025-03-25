import { useState } from "react";
import { Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import checklist from "../../assets/checklist.svg";

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
                                    : "bg-white text-lowokwaru"
                            }`}
                            onClick={() => setSelectedPackage(pkg.id)}
                        >
                            <p className="text-3xl font-semibold mb-4 text-lowokwaru">
                                Rp {pkg.price.toLocaleString()}
                            </p>
                            <h3 className="text-xl font-bold">{pkg.name}</h3>
                            <p className="text-sm ">
                                For most bussiness want that want to optimize
                                web queries
                            </p>
                            <br />
                            <ul className="text-sm flex">
                                <div className="flex items-center justify-center border bg-pandanwangi rounded-lg p-2 w-2 h-2">
                                    <img
                                        src={checklist}
                                        className="w-1 h-1"
                                        alt="Checklist"
                                    ></img>
                                </div>
                                <li>Peningkatan Visibilitas</li>
                                <li>Menjangkau banyak pengguna</li>
                                <li>Laporan analisis</li>
                            </ul>

                            <p className="text-sm">
                                Durasi posting {pkg.duration}
                            </p>
                            {pkg.popular && (
                                <button className="bg-green-700 text-white text-xs px-3 py-1 rounded-full absolute top-64 right-16">
                                    MOST POPULAR
                                </button>
                            )}

                            <div className="mt-12 text-center">
                                <Link
                                    href={route("land.create", {
                                        package: selectedPackage,
                                    })}
                                    className={`mt-6 w-full px-12 py-3 rounded-3xl border transition ${
                                        selectedPackage
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
