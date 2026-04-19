export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#06111f",
        mist: "#d8e4ff",
        flare: "#ff8552",
        ember: "#ef4444",
        surf: "#0d2037"
      },
      boxShadow: {
        panel: "0 20px 60px rgba(0, 0, 0, 0.28)"
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["DM Sans", "sans-serif"]
      }
    }
  },
  plugins: []
};
