import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          cyan: "#06b6d4",
          purple: "#8b5cf6",
          pink: "#ec4899",
          amber: "#f2b760",
          blue: "#3b82f6",
        }
      },
      fontFamily: {
        sans: ["Manrope", "Avenir Next", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "Avenir Next Condensed", "Trebuchet MS", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(139, 92, 246, 0.25)",
        "glow-cyan": "0 0 40px rgba(6, 182, 212, 0.25)"
      },
      backgroundImage: {
        "radar-grid": "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)"
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
