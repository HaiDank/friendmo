//tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./public/*.{html}',
		'./src/views/**/*.{js,ts,jsx,tsx, hbs}',
		'./src/views/*.{js,ts,jsx,tsx, hbs}',
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
