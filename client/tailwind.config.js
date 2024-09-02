/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "dark-bg": "#121212",
            },
            boxShadow:{
                "solid-box":"5px 5px 0px 0px #4f4e4e",
                "active-solid-box":"0px 0px 0px 0px #4f4e4e",
            }
        },
    },
    plugins: [],
};
