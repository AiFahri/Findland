import Card from "../Components/Card";
import tanah1 from "../../assets/tanah1.jpg";
import tanah2 from "../../assets/tanah2.jpg";
import Footer from "../Components/Footer";
import { useState } from "react";

const data = [
    {
        image: tanah1,
        status: "Dijual",
        price: "200000000",
        place: "Blimbing, Kota Malang",
        description:
            "Dijual cepat tanah seluas 11m di daerah sumberpucung lokasi strategis",
        id: 1,
    },
    {
        image: tanah1,
        status: "Disewa",
        price: "200000000",
        place: "Blimbing, Kota Malang",
        description:
            "Dijual cepat tanah seluas 11m di daerah sumberpucung lokasi strategis",
        id: 2,
    },
    {
        image: tanah1,
        status: "Dijual",
        price: "200000000",
        place: "Blimbing, Kota Malang",
        description:
            "Dijual cepat tanah seluas 11m di daerah sumberpucung lokasi strategis",
        id: 3,
    },
    {
        image: tanah1,
        status: "Dijual",
        price: "200000000",
        place: "Blimbing, Kota Malang",
        description:
            "Dijual cepat tanah seluas 11m di daerah sumberpucung lokasi strategis",
        id: 4,
    },
    {
        image: tanah1,
        status: "Dijual",
        price: "200000000",
        place: "Blimbing, Kota Malang",
        description:
            "Dijual cepat tanah seluas 11m di daerah sumberpucung lokasi strategis",
        id: 5,
    },
    {
        image: tanah1,
        status: "Dijual",
        price: "200000000",
        place: "Blimbing, Kota Malang",
        description:
            "Dijual cepat tanah seluas 11m di daerah sumberpucung lokasi strategis",
        id: 6,
    },
];

const Product = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const images = [tanah1, tanah2, tanah1];

    const handlePrev = () => {
        setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
    return (
        <div className="p-8">
            {/* Title */}
            <div className=" p-6 rounded-3xl shadow-lg mx-auto flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Image Section */}
                <div className="relative w-full md:w-1/2 h-64 md:h-auto rounded-xl overflow-hidden">
                    <img
                        src={images[currentImage]}
                        alt={`Property View ${currentImage + 1}`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-between p-4">
                        <button
                            onClick={handlePrev}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={handleNext}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Information Section */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <h2 className="text-lg font-medium text-gray-700">
                        Blimbing, Kota Malang
                    </h2>
                    <h3 className="text-2xl font-bold text-green-600">
                        Rp 200.000.000
                    </h3>
                    <span className="bg-green-600 text-white text-sm font-medium px-4 py-1 rounded-full w-fit">
                        Dijual
                    </span>

                    <p className="text-gray-600 leading-relaxed">
                        Lokasi yang strategis tentu saja harus memiliki akses
                        jalan yang lebar. Tanah ini memiliki akses jalan lebar
                        hingga 7 meter.
                    </p>

                    <div className="text-gray-600">
                        <p>Info sekitar lokasi:</p>
                        <ul className="list-disc list-inside">
                            <li>5 Menit Kampus Polinema</li>
                            <li>10 Menit Kampus Universitas Brawijaya</li>
                            <li>15 Menit Kampus Universitas Malang</li>
                        </ul>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                            Lihat Peta
                        </button>
                        <button className="bg-white border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-100 transition">
                            WhatsApp
                        </button>
                    </div>
                </div>
            </div>
            {/* Cards */}
            <h1 className="text-4xl font-extrabold text-[#3E5245] ">
                Properti Lainnya
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mb-12 px-4">
                {" "}
                {data.map((item) => (
                    <Card
                        key={item.id}
                        image={item.image}
                        status={item.status}
                        price={item.price}
                        place={item.place}
                        description={item.description}
                    />
                ))}
            </div>
            <Footer />
        </div>
    );
};
export default Product;
