import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/component/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
  plugins: [],
};
export default config;
