import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/Card";
import { formatRupiah, truncateText } from "@/Utils/formatter";
import findlandputih from "../../../public/assets/findland_white.svg";

const Home = ({
    latestProperties,
    featuredProperties,
    // canLogin,
    // canRegister,
}) => {
    return (
        <>
            <Head title="FindLand - Temukan Properti Impian Anda" />
            {/* <Navbar auth={auth} /> */}
            <div className="w-full h-full object-cover mt-4">
                <div className="relative flex items-center gap-1 mt-2">
                    <img
                        src="/assets/landingpage.jpg"
                        className="w-full h-auto object-cover"
                        alt="Landing Page"
                    />

                    <div className="absolute font-bold text-md sm:text-3xl md:text-4xl lg:text-5xl text-white bottom-4 mb:bottom-8 left-4 sm:left-10 md:left-16">
                        <h1>Jual Beli Tanah</h1>
                        <span>Terpercaya</span>
                        <div className="flex items-center gap-x-2 mt-1 sm:mt-2">
                            <img
                                src={findlandputih}
                                alt="Findland Logo"
                                className="w-4 h-4 sm:w-8 sm:h-8 md:w-10 md:h-10"
                            />
                            <span className="font-light font-sonsie text-xs sm:text-sm md:text-base text-white">
                                Findland
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="">
                <div className="flex justify-between items-center mt-6 mb-6">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-[#3E5245]">
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
                    {latestProperties.map((property) => (
                        <Link
                            key={property.id}
                            href={`/layanan/${
                                property.status === "Dijual" ? "beli" : "sewa"
                            }`}
                            preserveState
                            preserveScroll
                        >
                            <Card
                                image={property.image}
                                status={property.status}
                                price={formatRupiah(property.price)}
                                description={truncateText(
                                    property.description,
                                    50
                                )}
                                place={property.place}
                            />
                        </Link>
                    ))}
                </div>
            </section>

            <section className="">
                <h1 className="text-2xl md:text-4xl font-extrabold text-[#3E5245] mt-6 mb-6">
                    Properti Pilihan
                </h1>
                {featuredProperties.length > 0 ? (
                    <Swiper
                        modules={[Navigation, Pagination, A11y]}
                        spaceBetween={20}
                        slidesPerView={3}
                        navigation
                        pagination={{ clickable: true }}
                        a11y={{
                            prevSlideMessage: "Previous slide",
                            nextSlideMessage: "Next slide",
                        }}
                        breakpoints={{
                            0: { slidesPerView: 1, spaceBetween: 10 },
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 30 },
                        }}
                    >
                        {featuredProperties.map((property) => (
                            <SwiperSlide key={property.id}>
                                <Link
                                    href={`/layanan/${
                                        property.status === "Dijual"
                                            ? "beli"
                                            : "sewa"
                                    }`}
                                    preserveState
                                    preserveScroll
                                >
                                    <Card
                                        image={property.image}
                                        status={property.status}
                                        price={formatRupiah(property.price)}
                                        description={truncateText(
                                            property.description,
                                            50
                                        )}
                                        place={property.place}
                                    />
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p className="text-gray-500 text-center">
                        Tidak ada properti pilihan saat ini
                    </p>
                )}
            </section>

            <section className="flex flex-col md:flex-row items-stretch gap-6 bg-white rounded-3xl mt-10 md:mt-8 mb-6 ">
                <div className="bg-lowokwaru text-bunulrejo rounded-3xl flex-1 flex flex-col justify-between p-8 min-h-full md:h-auto">
                    <div className="text-left text-md md:text-4xl font-medium leading-tight p-4">
                        <h1>Jual tanah dengan mudah</h1>
                        <h1>dan cepat hanya di</h1>
                        <h1>findland</h1>
                    </div>
                    <button className="bg-[#0074E8] text-white px-6 py-3 rounded-2xl font-medium self-end">
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
            </section>

            {/* {(canLogin || canRegister) && (
                <div className="fixed top-0 right-0 p-4 text-right">
                    {canLogin && (
                        <Link
                            href={route("login")}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            Log in
                        </Link>
                    )}

                    {canRegister && (
                        <Link
                            href={route("register")}
                            className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            Register
                        </Link>
                    )}
                </div>
            )} */}
        </>
    );
};

Home.layout = (page) => <MainLayout children={page} />;

export default Home;
