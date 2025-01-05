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
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        mdlg: "896px", // New breakpoint between md and lg
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
    },
  },
  plugins: [],
} satisfies Config;
