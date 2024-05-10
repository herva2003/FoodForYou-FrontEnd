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
        "dark-grey": "#383838",
        "secondary-darker": "#2F2F2F",
        "dark-white": "#EEEEEE",
      },
    },
    fontFamily: {
      main: ["Inter", "sans-serif"],
    },
  },
  plugins: [],
};
