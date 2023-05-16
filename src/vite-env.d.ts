/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.svg?c' {
	import { SvelteComponentTyped } from 'svelte'
	import type { SVGAttributes } from 'svelte/elements'

	declare class SvelteComponentSVG extends SvelteComponentTyped<SVGAttributes<SVGElement>> {}
	export default SvelteComponentSVG
}

declare module '*.svg?component' {
	export { default } from '*.svg?c'
}
