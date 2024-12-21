/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            colors: {
                "clara-blue-dark": "#007CC6",
                "clara-blue-light": "#96CADE",
                "clara-pink-light": "#FCC0CE",
                "clara-pink-dark": "#F6BDFD",
                "clara-yellow": "#FFC16A",
                "clara-text-blue": "#003352",
                "clara-purple": "#7D2F5D",
            },
            fontFamily: {
                figtree: ["Figtree", "sans-serif"],
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
            },
        },
    },
    plugins: [],
};
