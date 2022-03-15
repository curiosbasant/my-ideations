// @ts-check

/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
  content: ["src/**/*.tsx"],
  darkMode: "class",

  theme: {
    extend: {
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      keyframes: {
        loading: {
          "0%": {
            opacity: "0.33",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1.2)",
          },
        },
      },
      animation: {
        loading: "loading 450ms ease-in-out alternate infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("./plugins/hover-balloons"),
    //
  ],
}