/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#4f46e5", soft: "rgba(79,70,229,.12)" } },
      boxShadow: { soft: "0 4px 16px rgba(0,0,0,.06)" },
    },
  },
  plugins: [],
};
