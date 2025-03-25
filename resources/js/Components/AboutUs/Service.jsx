import { useState } from "react";

const services = [
    {
        id: 1,
        title: "Jual Beli Lahan",
        description:
            "Kemudahan dalam menemukan atau menjual properti terbaik, dengan setiap transaksi dilakukan secara transparan dan aman untuk kenyamanan dan kepuasan pelanggan.",
    },
    {
        id: 2,
        title: "Sewa Lahan",
        description:
            "Solusi fleksibel untuk kebutuhan lahan berbagai keperluan, dengan pilihan lokasi strategis sesuai preferensi dan anggaran.",
    },
    {
        id: 3,
        title: "Konsultasi Notaris",
        description:
            "Pengelolaan dokumen legal terkait transaksi properti secara profesional, dengan jaminan keabsahan dan perlindungan hukum dalam setiap proses.",
    },
];

export default function Layanan() {
    const [hovered, setHovered] = useState(null);

    return (
        <section className="max-w-7xl mx-auto py-16 px-6 md:px-12 lg:px-20 bg-white p-6 rounded-2xl border border-gray-200 mt-8 mb-8">
            <h2 className="text-5xl md:text-5xl font-bold text-green-900 mb-10">
                Layanan
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service.id}
                        onMouseEnter={() => setHovered(service.id)}
                        onMouseLeave={() => setHovered(null)}
                        className={`relative p-6 pt-36 rounded-2xl transition-all duration-300 border border-gray-200 shadow-md ${
                            hovered === service.id
                                ? "bg-lowokwaru text-white shadow-xl "
                                : "bg-white text-green-900"
                        }`}
                    >
                        <span
                            className={`absolute top-4 right-6 text-2xl font-bold transition-all duration-300 ${
                                hovered === service.id
                                    ? "text-white text-4xl"
                                    : "text-green-900 text-4xl"
                            }`}
                        >
                            {service.id < 10 ? `0${service.id}` : service.id}
                        </span>

                        {/* Judul */}
                        <h3
                            className={`text-2xl font-semibold transition-all duration-300 ${
                                hovered === service.id
                                    ? "text-white text-4xl"
                                    : "text-green-900 text-4xl"
                            }`}
                        >
                            {service.title}
                        </h3>

                        <p
                            className={`mt-4 transition-all duration-300 ${
                                hovered === service.id
                                    ? "text-white"
                                    : "text-gray-700"
                            }`}
                        >
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
