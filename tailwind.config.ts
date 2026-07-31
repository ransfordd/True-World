import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ttw-gold": "#C0A04C",
        "premium-gold": "#C0A04C",
        "premium-black": "#030303",
        "premium-gray": "#1a1a1a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        cinzel: ["var(--font-cinzel)", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
