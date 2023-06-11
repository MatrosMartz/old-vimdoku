import { writable } from 'svelte/store'
import { HistoryService } from '~/domain/services'
import { DataStorageBrowser } from '$infra/browser/repositories/local-storage.repo'
import { HistoryRepo } from '~/infrastructure/repository/history.repo'

const historyStorage = new DataStorageBrowser<string[]>({ keyName: 'history' })
export const history = new HistoryService(new HistoryRepo({ storage: historyStorage }))

function createHistoryStore() {
	const { subscribe, set } = writable(history.getCurrent())

	const push = (cmd: string) => {
		history.push(cmd)
		set(history.getCurrent())
	}
	const redo = () => {
		history.redo()
		set(history.getCurrent())
	}
	const undo = () => {
		history.undo()
		set(history.getCurrent())
	}
	const updateAutocomplete = (cmd: string) => history.updateAutocomplete(cmd)

	return { subscribe, push, redo, undo, updateAutocomplete }
}

export const historyStore = createHistoryStore()
