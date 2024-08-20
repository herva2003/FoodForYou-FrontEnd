/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4254ED",
        white: "#fff",
        "dark-white": "#F4F8FC",
        secondary: "#FFCC99",

        title: "#454545",
        subtitle: "#ADB5BD",
        border: "#EEF0F5",
        remove: "#FF6464",
      },
    },
    fontFamily: {
      main: ["Inter", "sans-serif"],
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light']
  },
};
