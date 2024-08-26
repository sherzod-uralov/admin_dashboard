/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      colors: {
        "custom-purple-1": "#8971ea",
        "custom-purple-2": "#7f72ea",
        "custom-purple-3": "#7574ea",
        "custom-purple-4": "#6a75e9",
        "custom-purple-5": "#5f76e8",
      },
    },
  },
  plugins: [],
};
