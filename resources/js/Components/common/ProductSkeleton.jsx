import React from "react";
import CardSkeleton from "./CardSkeleton";
import SelectedProductSkeleton from "./SelectedProductSkeleton";

const ProductSkeleton = ({ hasSelectedProduct = false }) => {
    return (
        <div className="animate-pulse">
            {hasSelectedProduct && <SelectedProductSkeleton />}

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 mb-8 px-1">
                {Array.from({ length: 6 }, (_, index) => (
                    <div key={index} className="pb-1 pt-1">
                        <CardSkeleton />
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8 space-x-2 mb-6">
                {Array.from({ length: 5 }, (_, index) => (
                    <div
                        key={index}
                        className="h-10 w-10 bg-gray-200 rounded"
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ProductSkeleton;
