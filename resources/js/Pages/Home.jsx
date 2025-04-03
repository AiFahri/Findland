import React from "react";
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

const PropertyCard = ({ property }) => (
    <Link
        href={`/layanan/${property.status === "Dijual" ? "beli" : "sewa"}`}
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
        />
    </Link>
);

const Home = ({ latestProperties, featuredProperties }) => {
    console.log("Featured Properties:", featuredProperties);
    return (
        <PropertyProvider>
            <Head title="FindLand - Temukan Properti Impian Anda" />

            <div className="relative w-full mt-4">
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

            <section className="my-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-lowokwaru">
                        Properti Terbaru
                    </h1>
                    <Link
                        href="/layanan/beli"
                        className="text-green-600 hover:underline"
                    >
                        Lihat Semua
                    </Link>
                </div>
                <PropertySection
                    key="latest-slider"
                    properties={latestProperties}
                    isSlider
                />
            </section>

            <section className="my-6">
                <h1 className="text-2xl md:text-4xl font-extrabold text-lowokwaru mb-6">
                    Properti Pilihan
                </h1>
                {featuredProperties && featuredProperties.length > 0 ? (
                    <PropertySection
                        key="featured-slider"
                        properties={featuredProperties}
                        isSlider
                    />
                ) : (
                    <p className="text-gray-500 text-center">
                        Tidak ada properti pilihan saat ini
                    </p>
                )}
            </section>

            <section className="flex flex-col md:flex-row items-stretch gap-6 bg-white rounded-3xl my-10">
                <div className="bg-lowokwaru text-bunulrejo rounded-3xl flex-1 flex flex-col justify-between p-8">
                    <div className="text-left text-md md:text-4xl font-medium leading-tight p-4">
                        <h1>Jual tanah dengan mudah</h1>
                        <h1>dan cepat hanya di</h1>
                        <h1>findland</h1>
                    </div>
                    <Button
                        customColors="bg-blue-600 text-white "
                        className="self-end "
                    >
                        <Link href="/layanan/jual">Jual Sekarang</Link>
                    </Button>
                </div>
                <div className="w-full md:w-1/2 flex-1">
                    <img
                        src="/assets/landingpage2.jpg"
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
