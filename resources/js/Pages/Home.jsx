import { Link, router } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import findlandputih from "../../../public/assets/findland_white.svg";
import Card from "@/Components/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import datatanah from "@/Data/tanah.json";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
    const latestProperties = datatanah
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 6);
    const featuredProperties = datatanah
        .filter((item) => item.featured === true)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    const handlePropertySelect = (property) => {
        const route =
            property.status === "Dijual" ? "/layanan/beli" : "/layanan/sewa";

        router.visit(route, {
            data: {
                selectedProperty: property,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="px-12 py-8">
            <Navbar />
            <div className="w-full h-full object-cover mt-4">
                <div className="relative flex items-center gap-1 mt-2">
                    <img
                        src="/assets/landingpage.jpg"
                        className="w-full h-auto object-cover"
                    />

                    <div className="absolute font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white bottom-4 mb:bottom-8 left-4 sm:left-10 md:left-16">
                        <h1>Jual Beli Tanah</h1>
                        <span>Terpercaya</span>
                        <div className="flex items-center gap-x-2 mt-1 sm:mt-2">
                            <img
                                src={findlandputih}
                                alt="Findland Logo"
                                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                            />
                            <span className="font-light font-sonsie text-xs sm:text-sm md:text-base text-white">
                                Findland
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-extrabold text-[#3E5245]">
                        Properti Terbaru
                    </h1>
                    <Link
                        href="/layanan/beli"
                        className="text-green-600 hover:underline"
                    >
                        Lihat Semua
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {latestProperties.map((property, index) => (
                        <div
                            key={index}
                            onClick={() => handlePropertySelect(property)}
                            className="cursor-pointer hover:scale-105 transition-transform"
                        >
                            <Card
                                image={property.image}
                                status={property.status}
                                price={property.price}
                                description={property.description}
                                place={property.place}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-12">
                <h1 className="text-4xl font-extrabold text-[#3E5245] mb-6">
                    Properti Pilihan
                </h1>
                {featuredProperties.length > 0 ? (
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={10}
                        slidesPerView={3}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: Math.min(
                                    2,
                                    featuredProperties.length
                                ),
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: Math.min(
                                    3,
                                    featuredProperties.length
                                ),
                                spaceBetween: 30,
                            },
                        }}
                    >
                        {featuredProperties.map((property, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    onClick={() =>
                                        handlePropertySelect(property)
                                    }
                                    className="cursor-pointer hover:scale-105 transition-transform"
                                >
                                    <Card
                                        image={property.image}
                                        status={property.status}
                                        price={property.price}
                                        description={property.description}
                                        place={property.place}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p className="text-gray-500 text-center">
                        Tidak ada properti pilihan saat ini
                    </p>
                )}
            </div>

            <div className="flex flex-col md:flex-row items-stretch gap-6 bg-white rounded-3xl mt-10 md:mt-8 mb-6">
                <div className="bg-lowokwaru text-bunulrejo rounded-3xl flex-1 flex flex-col justify-between p-8 min-h-full md:h-auto">
                    <div className="text-left text-xl md:text-4xl font-medium leading-tight">
                        <h1>Jual tanah dengan mudah</h1>
                        <h1>dan cepat hanya di</h1>
                        <h1>findland</h1>
                    </div>
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium self-end">
                        <Link href="/layanan/jual">Jual Sekarang</Link>
                    </button>
                </div>
                <div className="w-full md:w-1/2 flex-1 min-h-full md:h-auto">
                    <img
                        src="/assets/landingpage2.jpg"
                        alt="Landing Page"
                        className="w-full h-full object-cover rounded-3xl"
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Home;
