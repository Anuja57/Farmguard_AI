/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f9ef",
          100: "#dfeeda",
          200: "#bedbb4",
          300: "#93c283",
          400: "#6ba95b",
          500: "#4d8f3f",
          600: "#3f7534",
          700: "#325b2c",
          800: "#2a4927",
          900: "#253f24"
        },
        soil: "#8c6239",
        cream: "#fbf7ef"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(77, 143, 63, 0.16)"
      },
      borderRadius: {
        xl2: "1.5rem"
      }
    },
  },
  plugins: [],
};

