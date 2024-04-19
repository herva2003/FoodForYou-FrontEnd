/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-blue": "#5429FF",
        "custom-grey": "#CBCCE8",
        "dark-grey": "#667085",
        "darker-grey": "#344054",
      },
    },
    fontFamily: {
      main: ["Inter", "sans-serif"],
    },
  },
  plugins: [],
};
