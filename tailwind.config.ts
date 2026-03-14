import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#041019",
        mist: "#eef7fb",
        slate: {
          50: "#f4f8fb",
          100: "#dde8ef",
          200: "#b7cad7",
          300: "#8ba7bb",
          400: "#6f8ca4",
          500: "#57718a",
          600: "#455c72",
          700: "#354858",
          800: "#24313d",
          900: "#131e29"
        },
        accent: {
          amber: "#f2b760",
          cyan: "#59c7ff",
          mint: "#8de7c4"
        }
      },
      fontFamily: {
        sans: ["Manrope", "Avenir Next", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "Avenir Next Condensed", "Trebuchet MS", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(5, 14, 22, 0.35)"
      },
      backgroundImage: {
        "radar-grid": "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
