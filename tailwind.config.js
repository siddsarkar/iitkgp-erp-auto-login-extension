const colors = require("tailwindcss/colors");

module.exports = {
    content: ["./src/pages/**/*.{html,js}"],
    theme: {
        colors: {
            primary: "#5c6ac4",
            secondary: "#ecc94b",
            ...colors,
        },
        extend: {},
    },
    darkMode: "class",
    plugins: [require("@tailwindcss/forms")],
};
