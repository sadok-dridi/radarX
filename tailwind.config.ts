import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09041a", // Deep dark purple-blue background
        mist: "#edf2fa",
        slate: {
          50: "#f5f3fa",
          100: "#e9e4f5",
          200: "#d1c7eb",
          300: "#b19edd",
          400: "#9374cc",
          500: "#7b51bd",
          600: "#683baa",
          700: "#572e90",
          800: "#4a2777",
          900: "#3c2160",
          950: "#1a0b33"
        },
        accent: {
          amber: "#f2b760",
          cyan: "#38bdf8", // map to bright neon blue
          mint: "#c084fc", // map to neon purple
          blue: "#3b82f6",
          purple: "#9333ea"
        }
      },
      fontFamily: {
        sans: ["Manrope", "Avenir Next", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "Avenir Next Condensed", "Trebuchet MS", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(147, 51, 234, 0.25)",
        "glow-blue": "0 0 40px rgba(56, 189, 248, 0.25)"
      },
      backgroundImage: {
        "radar-grid": "linear-gradient(rgba(147, 51, 234, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)"
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
      }
    }
  },
  plugins: []
};

export default config;
