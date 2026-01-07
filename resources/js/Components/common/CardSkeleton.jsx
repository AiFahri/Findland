import React from "react";

const CardSkeleton = ({ className = "" }) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-md overflow-hidden h-full animate-pulse ${className}`}
        >
            <div className="relative">
                <div className="w-full aspect-[4/3] bg-gray-200 rounded-t-2xl"></div>
            </div>
            <div className="p-3 sm:p-4 flex flex-col h-auto rounded-b-2xl">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                    <div className="h-5 w-16 sm:w-20 bg-gray-200 rounded mb-1 sm:mb-0"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                </div>

                <div className="mb-2">
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>

                <div className="flex flex-col mt-auto pt-1">
                    <div className="flex flex-wrap gap-1 mt-1">
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                    </div>

                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
                </div>
            </div>
        </div>
    );
};

export default CardSkeleton;
