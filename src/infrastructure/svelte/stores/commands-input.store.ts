import { readable } from 'svelte/store'

export const cmdInputStore = readable<HTMLInputElement | null>(null)
