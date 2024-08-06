import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/component/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        motoservis_red: "#ff5c5c",
        motoservis_red_dark: "#e65151 ",
        motoservis_yellow: "#ffd470",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          // ...
          colors: {
            primary: {
              //... 50 to 900
              foreground: "#ff5c5c",
              DEFAULT: "#ff5c5c",
            },
          },
        },
        dark: {
          // ...
          colors: {
            primary: {
              //... 50 to 900
              foreground: "#ff5c5c",
              DEFAULT: "#ff5c5c",
            },
          },
        },
        // ... custom themes
      },
    }),
  ],
};
export default config;
