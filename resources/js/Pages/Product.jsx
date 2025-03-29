import React, {
    useState,
    useEffect,
    useMemo,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Card from "../Components/common/Card";
import logomap from "../../assets/map.svg";
import logowa from "../../assets/wa.svg";
import { formatRupiah, truncateText } from "@/Utils/formatter";

const Product = forwardRef(({ data, initialSelectedProperty }, ref) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const productContainerRef = useRef(null);

    const propertyData = useMemo(
        () => (Array.isArray(data) ? data : []),
        [data]
    );

    const normalizeImages = (product) => {
        console.log("Original Product:", product);

        if (!product) return [];

        const normalizePath = (image) => {
            console.log("Processing image:", image);

            if (!image) return null;

            if (image.startsWith("/storage/")) {
                console.log("Already storage path:", image);
                return image;
            }

            if (typeof image === "string") {
                const cleanPath = image.replace(/^\/+/, "");
                const fullPath = `/storage/${cleanPath}`;
                console.log("Normalized path:", fullPath);
                return fullPath;
            }

            if (typeof image === "object" && image.path) {
                const cleanPath = image.path.replace(/^\/+/, "");
                const fullPath = `/storage/${cleanPath}`;
                console.log("Object image path:", fullPath);
                return fullPath;
            }

            console.log("Unhandled image type:", typeof image);
            return null;
        };

        let images = [];

        try {
            if (product.images && typeof product.images === "string") {
                const parsedImages = JSON.parse(
                    product.images.replace(/\\/g, "").replace(/^"|"$/g, "")
                );
                console.log("Parsed images:", parsedImages);
                images = parsedImages
                    .map((img) => {
                        const cleanImg = img
                            .replace(/^"|"$/g, "")
                            .replace(/^\/+/, "");
                        return `/storage/${cleanImg}`;
                    })
                    .filter(Boolean);
            }
        } catch (error) {
            console.error("Error parsing images:", error);
        }

        if (
            !images.length &&
            product.land_listing &&
            Array.isArray(product.land_listing.images)
        ) {
            console.log("Land listing images:", product.land_listing.images);
            images = product.land_listing.images
                .map(normalizePath)
                .filter(Boolean);
        }

        if (!images.length && product.image) {
            console.log("Single image:", product.image);
            const singleImage = normalizePath(product.image);
            if (singleImage) images.push(singleImage);
        }

        console.log("Normalized images:", images);
        return images;
    };

    useImperativeHandle(ref, () => ({
        resetSelectedProduct() {
            setSelectedProduct(null);
            setCurrentImageIndex(0);
        },
    }));

    useEffect(() => {
        if (initialSelectedProperty) {
            const matchedProperty = propertyData.find(
                (property) => property.id === initialSelectedProperty.id
            );

            if (matchedProperty) {
                setSelectedProduct(matchedProperty);
                if (productContainerRef.current) {
                    productContainerRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }
        }
    }, [initialSelectedProperty, propertyData]);

    useEffect(() => {
        if (!selectedProduct && propertyData.length > 0) {
            setSelectedProduct(null);
            setCurrentImageIndex(0);
        }
    }, [propertyData]);

    const handleProductSelect = (product) => {
        if (productContainerRef.current) {
            productContainerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }

        setSelectedProduct(product);
        setCurrentImageIndex(0);
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
                            navigation={false}
                            pagination={{
                                clickable: true,
                            }}
                            onSlideChange={(swiper) =>
                                setCurrentImageIndex(swiper.activeIndex)
                            }
                            className="w-full h-full"
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
                                                console.error(
                                                    "Image load error:",
                                                    {
                                                        originalSrc: image,
                                                        alt: `Property View ${
                                                            index + 1
                                                        }`,
                                                        fullImageObject:
                                                            selectedProduct,
                                                    }
                                                );
                                                e.target.style.display = "none";
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
                {propertyData.map((product, index) => (
                    <div
                        key={index}
                        onClick={() => handleProductSelect(product)}
                        className="cursor-pointer hover:scale-105 transition-transform"
                    >
                        <Card
                            image={
                                Array.isArray(product.images)
                                    ? product.images[0]
                                    : product.land_listing?.images?.[0] ||
                                      product.image
                            }
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
