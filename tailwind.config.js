import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            backgroundImage: {
                "login-pattern": "url('/assets/background.webp')",
            },
            colors: {
                pandanwangi: "#8EB69B",
                bunulrejo: "#DAF1DD",
                lowokwaru: "#3E5245",
                blimbing: "#153832",
            },
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                sonsie: ['"Sonsie One"', "cursive"],
                satoshi: ['"Satoshi"', "sans-serif"],
            },
            keyframes: {
                shimmer: {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                fadeOut: {
                    "0%": { opacity: "1" },
                    "100%": { opacity: "0" },
                },
            },
            animation: {
                shimmer: "shimmer 2s infinite",
                fadeIn: "fadeIn 0.5s ease-in-out",
                fadeOut: "fadeOut 0.5s ease-in-out",
            },
        },
    },

    plugins: [forms],
};
