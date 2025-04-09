/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        violet: {
          400: "#c084fc",
          500: "#a855f7",
          600: "#582CFF",
          700: "#4c25d9",
          900: "#4c1d95",
        },
      },
      backgroundImage: {
        "auth-gradient":
          "linear-gradient(159.02deg, rgb(77, 83, 166) 14.25%, #090D2E 56.45%, rgb(58, 68, 122) 86.14%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
