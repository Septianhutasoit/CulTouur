import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                vistara: {
                    deep: "#064E3B",   // Deep Emerald (Background/Brand)
                    neon: "#10B981",   // Neon Mint (Aksen/Tombol)
                    dark: "#051A13",   // Ultra Dark Forest
                },
            },
        },
    },
    plugins: [],
};
export default config;