import React from 'react';

const Button = ({ 
    children, 
    variant = 'primary', 
    className = '',
    customColors,
    ...props 
}) => {
    const baseStyle = "px-5 py-2 rounded-xl font-medium transition-colors";
    
    const variants = {
        primary: "bg-lowokwaru text-white hover:bg-opacity-90",
        secondary: "bg-bunulrejo text-lowokwaru hover:bg-opacity-90",
        outline: "border-2 border-lowokwaru text-lowokwaru hover:bg-lowokwaru hover:text-white",
        custom: customColors
    };

    const buttonStyle = customColors ? variants.custom : variants[variant];

    return (
        <button 
            className={`${baseStyle} ${buttonStyle} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
