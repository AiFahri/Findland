import React from "react";

const Card = ({
    image,
    title,
    status,
    price,
    description,
    place,
    className = "",
    ...props
}) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-md overflow-hidden h-full ${className}`}
            {...props}
        >
            <div className="relative">
                <img
                    src={image}
                    alt={description}
                    className="w-fit h-full sm:h-full md:h-full object-cover rounded-t-2xl"
                />
            </div>
            <div className="p-3 sm:p-4 flex flex-col h-auto rounded-b-2xl">
                {title && (
                    <h3 className="text-sm sm:text-base font-bold text-lowokwaru mb-2 line-clamp-1">
                        {title}
                    </h3>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                    <div className="flex items-center justify-center text-[10px] sm:text-xs border w-16 sm:w-20 bg-lowokwaru text-white rounded-md px-1 py-0.5 flex-shrink-0 mb-1 sm:mb-0">
                        {status}
                    </div>

                    <p className="text-sm sm:text-base md:text-lg font-extrabold text-[#235347] truncate">
                        {price}
                    </p>
                </div>
                <div className="h-10 sm:h-12 overflow-hidden">
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {description}
                    </p>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-auto pt-0">
                    {place}
                </p>
            </div>
        </div>
    );
};

export default Card;
