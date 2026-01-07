import { useState } from "react";
import { Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import checklist from "../../assets/checklist.svg";
import checklistWhite from "../../assets/checklist-white.svg";
import { formatRupiah, truncateText } from "@/Utils/formatter";

const packages = [
    {
        id: 1,
        name: "Paket 1",
        price: 334000,
        duration: "1 Bulan",
        title: "Paket Silver",
        subtitle: "Hemat & Efisien untuk Awal Promosi",
        features: [
            "Tampil di halaman terbaru website",
            "Bisa dilihat semua pengunjung",
            "Info lahan lengkap",
            "Durasi tayang postingan 1 bulan",
        ],
    },
    {
        id: 2,
        name: "Paket 2",
        price: 10,
        duration: "3 Bulan",
        title: "Paket Gold",
        subtitle: "Jangkauan Lebih Luas, Tayang Lebih Lama",
        features: [
            "Tampil di halaman terbaru website",
            "Diakses lebih banyak pengunjung",
            "Info lahan lengkap",
            "Hemat dan postingan lebih lama",
            "Durasi posting 3 bulan",
        ],
    },
    {
        id: 3,
        name: "Paket 3",
        price: 1900000,
        duration: "6 Bulan",
        popular: true,
        title: "Paket Platinum ⭐",
        subtitle: "Tampil Menonjol & Dapat Bonus Promosi",
        features: [
            "Muncul di halaman kategori pilihan",
            "Bisa dilihat lebih banyak calon pembeli",
            "Info lahan tampil lengkap",
            "Bonus tayang 1x di IG Story Findland",
            "Durasi posting 6 bulan",
        ],
    },
    {
        id: 4,
        name: "Paket 4",
        price: 3800000,
        duration: "12 Bulan",
        title: "Paket Diamond",
        subtitle: "Promosi Maksimal untuk Penjualan Lebih Cepat",
        features: [
            "Tampil di kategori pilihan website",
            "Dapat sorotan khusus dan tayang lebih menarik",
            "Promosi mingguan di IG Story & Sorotan",
            "Konten video diposting di YouTube Findland",
            "Durasi posting 12 bulan",
        ],
    },
];

const Pricing = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);

    return (
        <>
            <div className="p-4 md:p-8 bg-white border rounded-2xl shadow-md mt-8 mb-8 pb-5 md:pb-10">
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-pandanwangi mb-6 md:mb-10 text-left">
                    Tentukan Paket Postingan
                    <span className="block">Lahan Tanah Anda. </span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`relative p-6 pt-12 border rounded-2xl shadow-md text-left transition-all duration-300 ${
                                selectedPackage === pkg.id
                                    ? "bg-pandanwangi text-white"
                                    : "bg-white text-lowokwaru"
                            } flex flex-col h-full`}
                            onClick={() => setSelectedPackage(pkg.id)}
                        >
                            {pkg.popular && (
                                <div className="absolute top-3 right-4 bg-lowokwaru text-bunulrejo text-xs lg:text-md px-4 py-2 rounded-full">
                                    TERPOPULER
                                </div>
                            )}
                            <div className="flex flex-col flex-grow">
                                <p className="text-3xl lg:text-4xl font-semibold mb-4 text-lowokwaru">
                                    {formatRupiah(pkg.price)}
                                </p>
                                <h3 className="text-xl lg:text-3xl font-bold">
                                    {pkg.title}
                                </h3>
                                <p className="text-sm lg:text-lg">
                                    {pkg.subtitle}
                                </p>
                                <br />
                                <ul className="text-sm lg:text-lg space-y-3 flex-grow">
                                    {pkg.features.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center mt-1">
                                                <div
                                                    className={`absolute border w-5 h-5 rounded-full ${
                                                        selectedPackage ===
                                                        pkg.id
                                                            ? "bg-white opacity-10 border-white"
                                                            : "bg-pandanwangi border-pandanwangi"
                                                    }`}
                                                />
                                                <img
                                                    src={
                                                        selectedPackage ===
                                                        pkg.id
                                                            ? checklistWhite
                                                            : checklist
                                                    }
                                                    className="w-3 h-3 z-10"
                                                    alt="Checklist"
                                                />
                                            </div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-6 text-center">
                                <Link
                                    href={route("land.create", {
                                        package: pkg.id,
                                    })}
                                    className={`w-full px-4 md:px-12 py-2 md:py-3 text-sm md:text-base lg:text-xl rounded-3xl border transition inline-block ${
                                        selectedPackage === pkg.id
                                            ? "bg-bunulrejo text-lowokwaru hover:bg-opacity-90"
                                            : "bg-gray-200 text-lowokwaru cursor-not-allowed"
                                    }`}
                                    disabled={selectedPackage !== pkg.id}
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
