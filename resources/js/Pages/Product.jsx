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
        normalizeImages,
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
        <div ref={productContainerRef}>
            {selectedProduct && (
                <section className="rounded-3xl shadow-lg mx-auto flex flex-col md:flex-row items-center md:items-start p-6 md:p-0 mt-4">
                    <div className="relative w-full md:w-3/5 aspect-video rounded-xl overflow-hidden">
                        <Swiper
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
                        >
                            {normalizeImages(selectedProduct).map(
                                (image, index) => (
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
                                                
                                                // Jika ini adalah array path, coba path berikutnya
                                                const paths = Array.isArray(image) ? image : [image];
                                                const currentIndex = paths.indexOf(currentSrc);
                                                const nextPath = paths[currentIndex + 1];
                                                
                                                if (nextPath) {
                                                    img.src = nextPath;
                                                } else {
                                                    // Jika semua path sudah dicoba, gunakan default image
                                                    img.src = '/assets/default-property.jpg';
                                                    img.onerror = null; // Prevent infinite loop
                                                }
                                                
                                                console.debug('Image load error:', {
                                                    originalSrc: currentSrc,
                                                    nextPath: nextPath || 'using default',
                                                    alt: `Property View ${index + 1}`,
                                                    availablePaths: paths
                                                });
                                            }}
                                        />
                                    </SwiperSlide>
                                )
                            )}
                        </Swiper>
                    </div>
                    <div className="w-full md:w-2/5 md:pl-6">
                        <h2 className="text-sm text-[#235347] font-thin">
                            {selectedProduct.place}
                        </h2>
                        <p className="text-3xl font-bold text-[#235347]">
                            {formatRupiah(selectedProduct.price)}
                        </p>
                        <span className="flex items-center justify-center text-sm border w-20 bg-lowokwaru text-white rounded-md ">
                            {selectedProduct.status}
                        </span>
                        <p className="text-sm text-gray-600 whitespace-pre-line mt-4">
                            {selectedProduct.desc_detail}
                        </p>
                        <div className="flex items-center gap-4 mt-8">
                            <Button
                                customColors="bg-pandanwangi text-bunulrejo hover:bg-opacity-90"
                                onClick={() => window.open(selectedProduct.maps, '_blank')}
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
                                customColors="bg-pandanwangi text-bunulrejo hover:bg-opacity-90"
                                onClick={() => window.open(selectedProduct.wa, '_blank')}
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

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 mb-8 px-1">
                {propertyData.map((product, index) => (
                    <div
                        key={index}
                        onClick={() => handleProductSelectWithScroll(product)}
                        className="cursor-pointer hover:scale-105 transition-transform pb-1 pt-1"
                    >
                        <Card
                            image={
                                Array.isArray(product.images)
                                    ? product.images[0]
                                    : product.land_listing?.images?.[0] ||
                                      product.image
                            }
                            title={product.title}
                            status={product.status}
                            price={formatRupiah(product.price)}
                            description={truncateText(product.description, 50)}
                            place={product.place}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
});

export default Product;


