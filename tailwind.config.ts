import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "25%": { transform: "translateY(-4px)" },
          "75%": { transform: "translateY(4px)" },
        },
      },
      animation: {
        "bounce-slow": "bounce 10s linear infinite",
      },
      gridTemplateColumns: {
        mainGrid: "2fr 10fr",
        studentList: "repeat(auto-fill,minmax(250px,1fr))",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        mainColor: "#F0C808",
        backgroundBodyColor: "#FFFDF4",
        secoundaryColor: "#E7F9FF",
        baseColour: "#93F8A9",
        isolatedColour: "#C1532C",
        mainGroupColour: "#ECEA9C",
        headerButtonColor: "#052F3D",
        headerButtonHoverColor: "#122A33",
        buttonColor: "#043039",
        buttonHoverColor: "#394FBF",
        headerFooterMainColor: "#b3ff99",
        headerFooterSecoundaryColor: "#c6ffb3",
        crosswordSecoundaryColor: "#f9bc9d",
        modalMainColor: "#f8feef",
        crosswordCellSecoundaryColor: "#d9f99d",
        gameCardCrosswordColor: "#d9f99d",
      },
      boxShadow: {
        exerciseCardShadow: "0 10px 15px rgb(0 0 0/5%)",
        exerciseCardHowerShadow: "15px 10px 15px rgb(0 0 0/5%)",

        cardElementShadow: "0.3em 0.3em 1em rgba(0, 0, 0, 0.3)",
        cardElementStartShadow: "0.2em 0.2em 1em rgba(0, 0, 0, 0.2)",
        cardButtonShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        notificationShadow: "0px 0px 28px 23px rgba(64, 105, 136, 0.20)",
        crosswordGameCellMenuShadow:
          "rgba(0, 0, 0, 0.25) 0px 20px 50px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",

        crosswordGameCellMenuButtonActive: "rgba(0, 0, 0, 0.35) 10px 5px 15px",
        crosswordGameCellMenuButton: " rgba(0, 0, 0, 0.35) 0px 2px 8px 0px",
        innerLandShadow:
          "    rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
        smallShadow:
          "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
        audioControlsButtonShadow: "rgba(0, 0, 0, 0.35) 10px 5px 15px",
        audioControlsButtonHoverShadow: "rgba(0, 0, 0, 0.35) 15px 5px 12px",
      },
      fontFamily: {
        sans: ['"Proxima Nova"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
