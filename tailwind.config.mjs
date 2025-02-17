/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				poppins: ["var(--font-poppins)", "sans-serif"],
				roboto: ["var(--font-roboto)", "sans-serif"],
				inter: ["var(--font-inter)", "sans-serif"],
				nunito: ["var(--font-nunito)", "sans-serif"],
				ubuntu: ["var(--font-ubuntu)", "sans-serif"],
				montserrat: ["var(--font-montserrat)", "sans-serif"],
			},
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				brand: "var(--brand)",
				brand2: "var(--brand-2)",
				dark: "var(--dark)",
				cool: "var(--cool)",
				topc: "var(--topc)",
				bottomc: "var(--bottomc)",
			},
		},
	},
	plugins: [],
};
