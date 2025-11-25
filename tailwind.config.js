/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        main: "var(--main_color)",
        submain: "var(--submain_color)",
        light: "var(--light_color)",
        alte: "var(--alte_color)",
        text: "var(--text-color)",
        white: "var(--white)",
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        text: ["Roboto", "sans-serif"],
      },
      fontSize: {
        big: "var(--big_font)",
        mid: "var(--mid_font)",
        small: "var(--small_font)",
      },
      transitionDuration: {
        custom: "500",
      },
    },
  },
  plugins: [],
};
