import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import svelteSVG from 'vite-plugin-svelte-svg'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte(), svelteSVG(), tsconfigPaths()],
})
