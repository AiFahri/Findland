import React from "react";

const HeroBannerSkeleton = () => {
    return (
        <div className="relative w-full mt-7 animate-pulse">
            <div className="w-full aspect-[16/6] bg-gray-200 rounded-3xl"></div>
            <div className="absolute font-extrabold bottom-4 mb:bottom-8 left-4 sm:left-10 md:left-16">
                <div className="h-8 sm:h-10 md:h-14 lg:h-20 bg-gray-300 rounded w-48 sm:w-64 md:w-80 lg:w-96 mb-2"></div>
                <div className="h-6 sm:h-8 md:h-10 lg:h-16 bg-gray-300 rounded w-32 sm:w-48 md:w-64 lg:w-80"></div>
                <div className="flex items-center gap-x-2 mt-1 sm:mt-2">
                    <div className="h-4 w-4 sm:h-8 sm:w-8 md:h-16 md:w-16 bg-gray-300 rounded-full"></div>
                    <div className="h-3 sm:h-4 md:h-6 bg-gray-300 rounded w-20 sm:w-24 md:w-32"></div>
                </div>
            </div>
        </div>
    );
};

export default HeroBannerSkeleton;
