import React from "react";

const SelectedProductSkeleton = () => {
    return (
        <section className="rounded-3xl shadow-lg mx-auto flex flex-col md:flex-row items-center md:items-start p-6 md:p-0 mt-4 animate-pulse">
            <div className="relative w-full md:w-3/5 aspect-video rounded-xl overflow-hidden bg-gray-200"></div>
            <div className="w-full md:w-2/5 md:pl-6 mt-4 md:mt-0">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>

                <div className="h-6 w-20 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2 mb-8">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-10 w-32 bg-gray-200 rounded"></div>
                    <div className="h-10 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        </section>
    );
};

export default SelectedProductSkeleton;
