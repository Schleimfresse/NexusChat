/** @type {import('tailwindcss').Config} */
require("tailwindcss/colors");
module.exports = {
	mode: "jit",
	content: ["./src/**/*.{js,jsx}", "./public/index.html"],
	theme: {
		extend: {
			colors: {
				gray: {
					900: "#1E1F22",
					800: "#232428",
					700: "#2B2D31",
					600: "#4f545c",
					500: "#4d4d56",
					"500-modifier": "#4d4e56",
					"500-background-modifier-hover": "#393c41",
					400: "#d4d7dc",
					300: "#e3e5e8",
					200: "#ebedef",
					100: "#f2f3f5",
					secondary: "#969AA1",
					standard: "#313338",
					interactive: "#DADDE0",
					"header-secondary": "#b4b9c0",
					"header-primary": "#f3f4f6",
					"input-placeholder": "#87898c",
					"input-background": "#1d1e20",
					"input-text": "#DBDEE1",
					"button-secondary": "#4E5058",
					"button-secondary-hover": "#6d6f78",
					channel: "#80848e",
					"channel-selected": "#3F4248"
				},
			},
			keyframes: {
				drop: {
					"0%": { transform: "translateY(0px)" },
					"10%": { transform: "translateY(1px)" },
					"90%": { transform: "translateY(1px)" },
					"100%": { transform: "translateY(0px)" },
				},
			},
			animation: {
				drop: ".1s linear drop",
			},
			width: {
				modal: 440,
			},
			height: {
				modal: 558,
			},
			fontFamily: {
				ggNormal: ["GGSansNormal", "sans"],
				ggNormalItalic: ["GGSansNormalItalic", "sans"],
				ggMedium: ["GGSansMedium", "sans"],
				ggMediumItalic: ["GGSansMediumItalic", "sans"],
				ggSemibold: ["GGSansSemibold", "sans"],
				ggBold: ["GGSansBold", "sans"],
				ggBoldItalic: ["GGSansBoldItalic", "sans"],
				ggExtrabold: ["GGSansExtrabold", "sans"],
			},
		},
		plugins: [],
	},
};
