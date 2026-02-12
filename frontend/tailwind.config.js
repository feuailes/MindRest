/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#1d4d4f", // Deep Forest Green/Teal
                accent: "#f07654",  // Warm Coral
                "background-light": "#fdfdfd",
                "background-dark": "#0f172a",
            },
            fontFamily: {
                display: ["Plus Jakarta Sans", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "12px",
            },
        },
    },
    plugins: [],
}
