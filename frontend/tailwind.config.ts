import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#080c14",
        surface: "#0f172a",
        card: "rgba(15, 23, 42, 0.75)",
        primary: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
          glow: "rgba(59, 130, 246, 0.35)",
        },
        cyber: {
          green: "#10b981",
          cyan: "#06b6d4",
          purple: "#8b5cf6",
          rose: "#f43f5e",
        },
        border: "rgba(255, 255, 255, 0.1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern":
          "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, rgba(8, 12, 20, 1) 70%)",
      },
      animation: {
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
