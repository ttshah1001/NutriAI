import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc",
          border: "#e2e8f0",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.03), 0 4px 20px -2px rgb(15 118 110 / 0.08)",
        elevated:
          "0 12px 40px -8px rgb(15 118 110 / 0.18), 0 4px 12px -4px rgb(0 0 0 / 0.06)",
        nav: "0 -4px 24px -4px rgb(15 23 42 / 0.08)",
      },
      backgroundImage: {
        "app-gradient":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgb(204 251 241 / 0.5), transparent), linear-gradient(to bottom, #f8fafc, #f0fdfa)",
        "hero-gradient":
          "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #115e59 100%)",
        "hero-glow":
          "radial-gradient(circle at 80% 20%, rgb(45 212 191 / 0.35), transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
