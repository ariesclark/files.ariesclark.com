import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/components/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				cloudflare: {
					1: "#fbad41",
					2: "#f6821f"
				}
			},
			fontFamily: {
				sans: ["var(--font-sans)", "sans-serif"]
			}
		}
	},
	// eslint-disable-next-line unicorn/prefer-module
	plugins: [require("tailwindcss-animate")]
};
export default config;
