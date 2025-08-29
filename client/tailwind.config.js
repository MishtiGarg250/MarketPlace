// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
