import React from "react";

const Card = ({
    image,
    title,
    status,
    price,
    description,
    desc_detail,
    place,
    land_area,
    certificate_type,
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
                    onError={(e) => {
                        e.target.src = "/assets/default-property.jpg";
                        e.target.onerror = null; 
                        console.debug("Card image load error:", {
                            originalSrc: image,
                            fallbackSrc: "/assets/default-property.jpg",
                            title: title,
                        });
                    }}
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
                <div className="flex flex-col mt-auto pt-1">
                    {(land_area || certificate_type) && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {land_area && (
                                <span className="text-[8px] sm:text-[10px] bg-gray-100 text-gray-700 px-1 py-0.5 rounded">
                                    {land_area} m²
                                </span>
                            )}
                            {certificate_type && (
                                <span className="text-[8px] sm:text-[10px] bg-gray-100 text-gray-700 px-1 py-0.5 rounded">
                                    {certificate_type}
                                </span>
                            )}
                        </div>
                    )}
                    <p className="text-[10px] sm:text-xs text-gray-500">
                        {place}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Card;
