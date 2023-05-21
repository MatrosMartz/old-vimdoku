import { writable } from 'svelte/store'
import { modesService } from '~/domain/services'

function createModesStore() {
	const { set, subscribe } = writable(modesService.setNormal())

	const setAnnotation = () => set(modesService.setAnnotation())
	const setCommand = () => set(modesService.setCommand())
	const setInsert = () => set(modesService.setInsert())
	const setNormal = () => set(modesService.setNormal())

	return { setAnnotation, setCommand, setInsert, setNormal, subscribe }
}

export const modesStore = createModesStore()
