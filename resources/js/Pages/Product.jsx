import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Card from "../Components/common/Card";
import Button from "../Components/common/Button";
import logomap from "../../assets/map.svg";
import logowa from "../../assets/wa.svg";
import { formatRupiah } from "@/Utils/formatter";
import { truncateText } from "@/Utils/formatter";
import { useProductDisplay } from "@/hooks/useProductDisplay";

const Product = forwardRef(({ data, initialSelectedProperty }, ref) => {
    const productContainerRef = useRef(null);
    const {
        selectedProduct,
        currentImageIndex,
        propertyData,
        setCurrentImageIndex,
        getPropertyImages,
        getPropertyThumbnail,
        handleProductSelect,
        resetSelectedProduct,
    } = useProductDisplay(data, initialSelectedProperty);

    useImperativeHandle(ref, () => ({
        resetSelectedProduct,
    }));

    const handleProductSelectWithScroll = (product) => {
        if (productContainerRef.current) {
            productContainerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
        handleProductSelect(product);
    };

    if (!propertyData || propertyData.length === 0) {
        return null;
    }

    return (
        <div ref={productContainerRef} id="product-container">
            {selectedProduct && (
                <section className="rounded-3xl shadow-lg mx-auto flex flex-col lg:flex-row p-6 lg:p-8 lg:gap-6 max-w-screen-7xl">
                    <div className="relative w-full md:w-5/5 lg:w-3/5 aspect-video rounded-xl overflow-hidden">
                        <Swiper
                            key={`swiper-${selectedProduct.id}-${Date.now()}`} // Tambahkan key yang unik untuk memaksa re-render
                            modules={[Navigation, Pagination]}
                            spaceBetween={10}
                            slidesPerView={1.25}
                            centeredSlides={false}
                            navigation={true}
                            pagination={{
                                clickable: true,
                            }}
                            onSlideChange={(swiper) =>
                                setCurrentImageIndex(swiper.activeIndex)
                            }
                            observer={true}
                            observeParents={true}
                            className="w-full h-full swiper-custom-navigation"
                            // Jika hanya ada 1 gambar, nonaktifkan navigasi dan pagination
                            {...(getPropertyImages(selectedProduct).filter(
                                (_, index) => index < 4
                            ).length <= 1 && {
                                navigation: false,
                                pagination: false,
                                allowTouchMove: false,
                            })}
                        >
                            {getPropertyImages(selectedProduct)
                                .filter((_, index) => index < 4) // Batasi maksimal 4 gambar
                                .map((image, index) => (
                                    <SwiperSlide
                                        key={index}
                                        className={`
                                        ${
                                            index === currentImageIndex
                                                ? "opacity-100"
                                                : "opacity-50"
                                        }
                                        transition-opacity duration-300 ease-in-out
                                    `}
                                    >
                                        <img
                                            src={image}
                                            alt={`Property View ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const img = e.target;
                                                const currentSrc = img.src;

                                                // Coba path alternatif berdasarkan ekstensi
                                                // Jika path saat ini adalah PNG, coba JPG dan JPEG
                                                if (
                                                    currentSrc.endsWith(".png")
                                                ) {
                                                    // Ekstrak base path (tanpa ekstensi)
                                                    const basePath =
                                                        currentSrc.substring(
                                                            0,
                                                            currentSrc.length -
                                                                4
                                                        );

                                                    // Coba JPG

                                                    img.src = basePath + ".jpg";

                                                    // Simpan referensi ke fungsi error handler asli
                                                    const originalOnError =
                                                        img.onerror;

                                                    // Set handler baru untuk mencoba JPEG jika JPG gagal
                                                    img.onerror = function () {
                                                        img.src =
                                                            basePath + ".jpeg";

                                                        // Kembalikan ke handler default jika JPEG juga gagal
                                                        img.onerror =
                                                            originalOnError;
                                                    };

                                                    return;
                                                }

                                                // Jika semua path alternatif sudah dicoba, gunakan default image
                                                img.src =
                                                    "/assets/default-property.jpg";
                                                img.onerror = null; // Prevent infinite loop
                                            }}
                                        />
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    </div>
                    <div className="w-full md:w-5/5 lg:w-2/5 md:pl-6">
                        <h2 className="text-md text-[#235347] font-extrabold lg:text-xl">
                            {selectedProduct.title}
                        </h2>
                        <h2 className="text-sm text-[#235347] font-thin lg:text-lg">
                            {selectedProduct.place}
                        </h2>
                        <p className="text-3xl font-bold text-[#235347] lg:text-4xl">
                            {formatRupiah(selectedProduct.price)}
                        </p>
                        <span className="flex items-center justify-center text-sm border w-20 bg-lowokwaru text-white rounded-md lg:text-lg">
                            {selectedProduct.status}
                        </span>
                        <p className="text-sm md:text-base lg:text-xl text-gray-600 whitespace-pre-line mt-4 text-justify mr-4 md:mr-8">
                            {selectedProduct.desc_detail}
                        </p>

                        <div className="flex items-center gap-4 mt-8">
                            <Button
                                customColors="bg-pandanwangi text-bunulrejo hover:bg-opacity-90 text-sm md:text-md lg:text-xl"
                                onClick={() =>
                                    window.open(selectedProduct.maps, "_blank")
                                }
                                className="flex items-center"
                            >
                                <img
                                    src={logomap}
                                    alt="Lihat Peta"
                                    className="w-6 h-6 mr-2"
                                />
                                Lihat Peta
                            </Button>
                            <Button
                                customColors="bg-pandanwangi text-bunulrejo hover:bg-opacity-90 text-sm lg:text-xl"
                                onClick={() => {
                                    // Nomor WhatsApp admin (ganti dengan nomor admin yang sebenarnya)
                                    const adminWhatsApp = "6287889601959"; // Ganti dengan nomor admin FindLand

                                    // Template pesan
                                    const message = `Halo Admin, Info detail lahan tanah yang tertera dengan nama lahan ${selectedProduct.title} apakah masih tersedia? Terima kasih.`;

                                    // Buat URL WhatsApp dengan template pesan
                                    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(
                                        message
                                    )}`;

                                    // Buka WhatsApp di tab baru
                                    window.open(whatsappUrl, "_blank");
                                }}
                                className="flex items-center"
                            >
                                <img
                                    src={logowa}
                                    alt="WhatsApp"
                                    className="w-6 h-6 mr-2"
                                />
                                WhatsApp
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mb-8">
                {propertyData.map((product, index) => (
                    <div
                        key={index}
                        onClick={() => handleProductSelectWithScroll(product)}
                        className="cursor-pointer hover:scale-105 transition-transform pb-1 pt-1"
                    >
                        <Card
                            image={
                                // Gunakan getPropertyThumbnail untuk konsistensi dengan Home.jsx
                                getPropertyThumbnail(product)
                            }
                            title={product.title}
                            status={product.status}
                            price={formatRupiah(product.price)}
                            description={truncateText(product.description, 100)}
                            place={product.place}
                            land_area={product.land_area}
                            certificate_type={product.certificate_type}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
});

export default Product;
