import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import CardSkeleton from "./CardSkeleton";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SectionTitleSkeleton = () => (
    <div className="flex justify-between items-center mb-6">
        <div className="h-8 md:h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-48 md:w-64 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        </div>
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-24 md:w-32 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        </div>
    </div>
);

const PropertySectionSkeleton = ({ isSlider = false, count = 6, showTitle = true }) => {
    const skeletonArray = Array.from({ length: count }, (_, index) => index);

    const content = isSlider ? (
        <div className="relative">
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
                    0: { slidesPerView: 1, spaceBetween: 10 },
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 30 },
                }}
            >
                {skeletonArray.map((index) => (
                    <SwiperSlide key={index} className="pb-3">
                        <div className="h-full">
                            <CardSkeleton />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 px-1">
            {skeletonArray.map((index) => (
                <div key={index} className="pb-1 pt-1">
                    <CardSkeleton />
                </div>
            ))}
        </div>
    );

    return (
        <div className="my-6">
            {showTitle && <SectionTitleSkeleton />}
            {content}
        </div>
    );
};

export default PropertySectionSkeleton;
