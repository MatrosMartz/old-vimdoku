import { writable } from 'svelte/store'
import { ModesService } from '~/domain/services'

export const modes = new ModesService()

function createModesStore() {
	const { set, subscribe } = writable(modes.setNormal())

	const setAnnotation = () => set(modes.setAnnotation())
	const setCommand = () => set(modes.setCommand())
	const setInsert = () => set(modes.setInsert())
	const setNormal = () => set(modes.setNormal())

	return { setAnnotation, setCommand, setInsert, setNormal, subscribe }
}

export const modesStore = createModesStore()
