module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { primary: '#243c5a', secondary: '#10b981' },
      backgroundImage: { 'hero-pattern': "url('/hero-bg.jpg')" },
    },
  },
  plugins: [],
};