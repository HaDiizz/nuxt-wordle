/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        night: {
          ...require("daisyui/src/theming/themes")["night"],
          ".bg-ground-100": {
            "background-color": "#09101f96",
          },
        },
      },
      {
        winter: {
          ...require("daisyui/src/theming/themes")["winter"],
          ".bg-ground-100": {
            "background-color": "#d2d7de47",
          },
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
