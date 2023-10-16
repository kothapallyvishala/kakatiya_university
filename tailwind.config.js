module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Bangers: ['"Bangers"', "sans serif"],
        Dongle: ["Dongle", "sans serif"],
        itim: ['"Itim"', "sans serif"],
        Acme: ["Acme", "sans serif"],
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateY(30%)", opacity: "0" },
          "100%": { transform: "translateY(0%)", opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slide 600ms ease-out 1",
        "spin-slow": "spin 3s linear infinite",
      },
      backgroundImage: {
        login: "url('/login.jpg')",
        register: "url('/register.jpg')",
        addClass: "url('/addClass.jpg')",
        addAssignment: "url('/addAssignment.jpg')",
        submitAssignment: "url('/submitAssignment.jpg')",
      },
    },
  },
  plugins: [],
};
