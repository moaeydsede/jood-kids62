import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brandBlue: "#28B5F6",
        brandPeach: "#FF9E86",
      },
    },
  },
  plugins: [],
};
export default config;
