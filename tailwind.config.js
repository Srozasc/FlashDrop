/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FFC107", // Amarillo FlashDrop
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#121212", // Negro Profundo
          foreground: "#FFFFFF",
        },
        background: "#FFFFFF",
        foreground: "#000000",
        muted: "#757575",
        success: "#4CAF50",
        destructive: "#D32F2F",
      },
    },
  },
  plugins: [],
};
