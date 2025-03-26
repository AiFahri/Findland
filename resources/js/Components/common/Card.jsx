import React from 'react';

const Card = ({
    image,
    status,
    price,
    description,
    place,
    className = '',
    ...props
}) => {
    return (
        <div className={`bg-white rounded-2xl shadow-md overflow-hidden ${className}`} {...props}>
            <div className="relative">
                <img src={image} alt={description} className="w-full h-48 object-cover"/>
            </div>
            <div className="p-4">
            <div className="flex">
                <div className="flex items-center justify-center text-sm border w-20 bg-lowokwaru text-white rounded-md ">
                    {status}
                </div>
                <p className="text-xl font-extrabold text-[#235347] ml-2">
                    {price}
                </p>
            </div>

                
                <p className="text-gray-600 mt-2">{description}</p>
                <p className="text-gray-500 mt-1 text-sm">{place}</p>
            </div>
        </div>
    );
};

export default Card;