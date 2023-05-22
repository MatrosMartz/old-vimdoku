import { writable } from 'svelte/store'

export const cmdInputStore = writable<HTMLInputElement | null>(null)
