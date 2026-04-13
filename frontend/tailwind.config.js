/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090909",
        paper: "#f7f7f2",
        line: "#d7d7cf",
        mist: "#ecece5",
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", "'Segoe UI'", "sans-serif"],
        display: ["'Bebas Neue'", "'Arial Narrow'", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 60px rgba(0, 0, 0, 0.08)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.45s ease-out",
      },
    },
  },
  plugins: [],
};
