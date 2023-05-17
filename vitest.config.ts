import { defineConfig, defaultInclude } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST }), tsconfigPaths()],
	test: {
		include: defaultInclude,
		environment: 'happy-dom',
		globals: true,
	},
})
