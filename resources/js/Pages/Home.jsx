import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/common/Card";
import Button from "@/Components/common/Button";
import { useProperty } from "@/hooks/useProperty";
import { PropertyProvider } from "@/contexts/PropertyContext";
import findlandputih from "../../../public/assets/findland_white.svg";
import CardSkeleton from "@/Components/common/CardSkeleton";
import PropertySectionSkeleton from "@/Components/common/PropertySectionSkeleton";
import HeroBannerSkeleton from "@/Components/common/HeroBannerSkeleton";

const PropertySection = ({ properties, isSlider = false }) => {
    const { formatPropertiesList } = useProperty();
    const formattedProperties = formatPropertiesList(properties);

    if (isSlider) {
        return (
            <Swiper
                modules={[Navigation, Pagination, A11y]}
                spaceBetween={20}
                slidesPerView={3}
                navigation={true}
                pagination={{ clickable: true }}
                className="pb-12 px-8 swiper-custom-navigation"
                loop={false}
                observer={true}
                observeParents={true}
                breakpoints={{
                    0: { slidesPerView: 2, spaceBetween: 10 },
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 30 },
                }}
            >
                {formattedProperties.map((property) => (
                    <SwiperSlide key={property.id} className="pb-3">
                        <div className="h-full">
                            <PropertyCard property={property} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 px-1">
            {formattedProperties.map((property) => (
                <div key={property.id} className="pb-1 pt-1">
                    <PropertyCard property={property} />
                </div>
            ))}
        </div>
    );
};

const PropertyCard = ({ property }) => {
    return (
        <Link
            href={`/layanan/${
                property.status === "Dijual" ? "beli" : "sewa"
            }?selectedPropertyId=${property.id}`}
            preserveState
            preserveScroll
        >
            <Card
                image={property.image}
                title={property.title}
                status={property.status}
                price={property.formattedPrice}
                description={property.shortDescription}
                place={property.place}
                land_area={property.land_area}
                certificate_type={property.certificate_type}
            />
        </Link>
    );
};

const Home = ({ latestProperties, featuredProperties }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const preloadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => reject();
                img.src = src;
            });
        };

        const heroBanner = preloadImage("/assets/hero-banner.webp");

        const propertyImages = [];
        if (latestProperties) {
            latestProperties.forEach((property) => {
                if (property.image) {
                    propertyImages.push(
                        preloadImage(`/storage/${property.image}`)
                    );
                }
            });
        }

        if (featuredProperties) {
            featuredProperties.forEach((property) => {
                if (property.image) {
                    propertyImages.push(
                        preloadImage(`/storage/${property.image}`)
                    );
                }
            });
        }

        const minDelay = new Promise((resolve) => setTimeout(resolve, 1000));

        Promise.all([heroBanner, ...propertyImages, minDelay])
            .then(() => {
                setLoading(false);
            })
            .catch(() => {
                setTimeout(() => setLoading(false), 1500);
            });

        return () => {
            // Cleanup
        };
    }, [latestProperties, featuredProperties]);

    return (
        <PropertyProvider>
            <Head title="FindLand - Temukan Properti Impian Anda" />

            <div className="relative">
                <div
                    className={`transition-opacity duration-500 ${
                        loading ? "opacity-100" : "opacity-0 absolute inset-0"
                    }`}
                >
                    <HeroBannerSkeleton />
                </div>

                <div
                    className={`transition-opacity duration-500 ${
                        loading ? "opacity-0" : "opacity-100"
                    }`}
                >
                    <div className="relative w-full mt-7">
                        <img
                            src="/assets/hero-banner.webp"
                            className="w-full h-auto object-cover rounded-3xl"
                            alt="Landing Page"
                        />
                        <div className="absolute font-extrabold text-md sm:text-3xl md:text-4xl lg:text-7xl text-white bottom-4 mb:bottom-8 left-4 sm:left-10 md:left-16">
                            <h1>Jual Beli Tanah</h1>
                            <span>Terpercaya</span>
                            <div className="flex items-center gap-x-2 mt-1 sm:mt-2">
                                <img
                                    src={findlandputih}
                                    alt="Findland Logo"
                                    className="w-4 h-4 sm:w-8 sm:h-8 md:w-16 md:h-16"
                                />
                                <span className="font-light font-sonsie text-left text-xs sm:text-sm md:text-4xl text-white scale-[0.8] -ml-2">
                                    Findland
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="my-6">
                <div className="flex justify-between items-center md:mt-20 mb-6">
                    <h1 className="text-2xl md:text-5xl font-extrabold text-lowokwaru">
                        Properti Terbaru
                    </h1>
                    <Link
                        href="/layanan/beli"
                        className="text-pandanwangi text-sm md:text-xl hover:underline hover:text-lowokwaru"
                    >
                        Lihat Semua
                    </Link>
                </div>

                <div className="relative">
                    <div
                        className={`transition-opacity duration-500 ${
                            loading
                                ? "opacity-100"
                                : "opacity-0 absolute inset-0 z-10"
                        }`}
                    >
                        <PropertySectionSkeleton isSlider count={6} />
                    </div>

                    <div
                        className={`transition-opacity duration-500 ${
                            loading ? "opacity-0" : "opacity-100"
                        }`}
                    >
                        <PropertySection
                            key="latest-slider"
                            properties={latestProperties}
                            isSlider
                        />
                    </div>
                </div>
            </section>

            <section className="my-6">
                <h1 className="text-2xl md:text-5xl font-extrabold text-lowokwaru mb-6">
                    Properti Pilihan
                </h1>

                <div className="relative">
                    <div
                        className={`transition-opacity duration-500 ${
                            loading
                                ? "opacity-100"
                                : "opacity-0 absolute inset-0 z-10"
                        }`}
                    >
                        <PropertySectionSkeleton isSlider count={3} />
                    </div>

                    <div
                        className={`transition-opacity duration-500 ${
                            loading ? "opacity-0" : "opacity-100"
                        }`}
                    >
                        {featuredProperties && featuredProperties.length > 0 ? (
                            <PropertySection
                                key="featured-slider"
                                properties={featuredProperties}
                                isSlider
                            />
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">
                                    Properti pilihan akan segera hadir. Silakan
                                    cek kembali nanti.
                                </p>
                                <Link
                                    href="/layanan/beli"
                                    className="inline-block mt-4 px-6 py-2 bg-bunulrejo text-lowokwaru rounded-lg hover:bg-opacity-90 transition"
                                >
                                    Lihat Semua Properti
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="flex flex-col md:flex-row items-stretch gap-6 rounded-3xl my-10 relative z-20">
                <div className="bg-lowokwaru text-bunulrejo rounded-3xl flex-1 flex flex-col justify-between p-8">
                    <h2 className="text-left text-xl md:text-4xl xl:text-6xl font-medium leading-tight p-4">
                        <span className="block">Jual tanah dengan mudah</span>
                        <span className="block">dan cepat hanya di</span>
                        <span className="block">findland</span>
                    </h2>
                    <div className="flex justify-end w-full relative z-30">
                        <Link href="/layanan/jual" className="relative z-30">
                            <Button
                                customColors="bg-blue-600 text-white hover:bg-blue-700"
                                className="text-sm sm:text-md md:text-md lg:text-2xl"
                            >
                                Jual Sekarang
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex-1">
                    <img
                        src="/assets/hero-image.webp"
                        alt="Landing Page"
                        className="w-full h-full object-cover rounded-3xl"
                    />
                </div>
            </section>
        </PropertyProvider>
    );
};

Home.layout = (page) => <MainLayout children={page} />;

export default Home;
