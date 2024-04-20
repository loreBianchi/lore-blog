/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        deepskyblue: {
          DEFAULT: "#00bfff",
          50: "#effaff",
          100: "#def4ff",
          200: "#b6ebff",
          300: "#75deff",
          400: "#2ccfff",
          500: "#00bfff",
          600: "#0095d4",
          700: "#0076ab",
          800: "#00638d",
          900: "#065374",
          950: "#04344d",
        },
      },
    },
  },
  plugins: [],
};
