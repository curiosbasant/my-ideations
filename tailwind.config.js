/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
  content: ["src/**/*.tsx"],
  darkMode: "class",

  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
}
