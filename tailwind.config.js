import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            backgroundImage: {
                'login-pattern': "url('/background.webp')",
            },
            colors: {
                pandanwangi: '#8EB69B',
                bunulrejo: '#DAF1DD',
                lowokwaru: '#3E5245',
                blimbing: '#153832',

            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                sonsie: ['"Sonsie One"', 'cursive'],
                satoshi: ['"Satoshi"', 'sans-serif'],
            },
        },
    },

    plugins: [forms],
};
