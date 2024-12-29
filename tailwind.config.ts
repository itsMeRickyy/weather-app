import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif", '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      colors: {
        darkMode: {
          100: "#7A8C99",
          200: "#4A5E6A",
          300: "#2C3E50",
          400: "#1A252F",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
