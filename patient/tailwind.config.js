/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF8F3",
        ink: "#1E2A2E",
        kiosk: {
          50: "#EAF6F6",
          100: "#CDEBEA",
          400: "#2E9A96",
          500: "#0E7C78",
          600: "#0B6560",
          700: "#094F4C",
        },
        marigold: {
          50: "#FDF1E4",
          400: "#E4A059",
          500: "#D98A34",
          600: "#B87024",
        },
        crimson: {
          50: "#FBEAEA",
          500: "#D6493F",
          600: "#B93A31",
        },
        moss: {
          50: "#EAF6EE",
          500: "#2F9E5B",
        },
        stone: {
          150: "#EEE9DF",
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', '"Noto Sans Devanagari"', "system-ui", "sans-serif"],
        sans: ['"Inter"', '"Noto Sans Devanagari"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        kiosk: "22px",
      },
      boxShadow: {
        kiosk: "0 2px 10px rgba(30,42,46,0.06), 0 1px 2px rgba(30,42,46,0.05)",
        raised: "0 10px 30px rgba(30,42,46,0.12)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "80%, 100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0.2,0.6,0.4,1) infinite",
      },
    },
  },
  plugins: [],
};
