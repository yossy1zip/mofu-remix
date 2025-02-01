import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Raleway",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        raleway: [
          'Raleway',
          'sans-serif'],
        'noto-sans': [
          'Noto Sans JP',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
