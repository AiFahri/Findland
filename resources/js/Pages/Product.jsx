import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Card from "../Components/Card";
import logomap from "../../assets/map.svg";
import logowa from "../../assets/wa.svg";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const Product = ({ data }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setSelectedProduct(null);
        setCurrentImageIndex(0);
    }, [data]);

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setCurrentImageIndex(0);
    };

    return (
        <div className="">
            {selectedProduct && (
                <section className="rounded-3xl shadow-lg mx-auto flex flex-col md:flex-row items-center md:items-start p-6 md:p-0">
                    <div className="relative w-full md:w-3/5 aspect-video rounded-xl overflow-hidden">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={10}
                            slidesPerView={1.25}
                            centeredSlides={false}
                            navigation={false}
                            pagination={{
                                clickable: true,
                            }}
                            onSlideChange={(swiper) =>
                                setCurrentImageIndex(swiper.activeIndex)
                            }
                            className="w-full h-full"
                        >
                            {selectedProduct.images.map((image, index) => (
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
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="w-full md:w-2/5 md:pl-6">
                        <h2 className="text-sm text-[#235347] font-thin">
                            {selectedProduct.place}
                        </h2>
                        <p className="text-3xl font-bold text-[#235347]">
                            Rp {formatPrice(selectedProduct.price)}
                        </p>
                        <span className="flex items-center justify-center text-sm border w-20 bg-lowokwaru text-white rounded-md ">
                            {selectedProduct.status}
                        </span>
                        <p className="text-sm text-gray-600 whitespace-pre-line mt-4">
                            {selectedProduct.desc_detail}
                        </p>
                        <div className="flex items-center gap-4 mt-8">
                            <a
                                href={selectedProduct.maps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center bg-pandanwangi text-bunulrejo px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                <img
                                    src={logomap}
                                    alt="Lihat Peta"
                                    className="w-6 h-6 mr-2"
                                />
                                Lihat Peta
                            </a>
                            <a
                                href={selectedProduct.wa}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center bg-pandanwangi border border-pandanwangi text-bunulrejo px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                <img
                                    src={logowa}
                                    alt="WhatsApp"
                                    className="w-6 h-6 mr-2"
                                />
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
                {data.map((product, index) => (
                    <div
                        key={index}
                        onClick={() => handleProductSelect(product)}
                        className="cursor-pointer hover:scale-105 transition-transform"
                    >
                        <Card
                            image={product.image}
                            status={product.status}
                            price={formatPrice(product.price)}
                            description={product.description}
                            place={product.place}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Product;
