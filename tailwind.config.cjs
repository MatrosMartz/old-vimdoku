const { join } = require('node:path')

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
	],

	theme: {
		extend: {},
		screens: {
			'xs': '475px',
			...require('tailwindcss/defaultTheme').screens
		}
	},

	plugins: [...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()],
}

module.exports = config
