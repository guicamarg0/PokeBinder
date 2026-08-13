import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#18202b", paper: "#f6f7fb", accent: "#ef5350" }
    }
  },
  plugins: []
};

export default config;
