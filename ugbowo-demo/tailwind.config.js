/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a6b3c",
        "primary-light": "#22863a",
        "primary-bg": "#f0faf4",
        "primary-dark": "#145530",
      },
    },
  },
  plugins: [],
}

