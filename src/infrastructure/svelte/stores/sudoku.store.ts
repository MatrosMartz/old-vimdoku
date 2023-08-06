import { derived, writable } from 'svelte/store'

import { Notes } from '~/domain/entities'
import { BoardService, SelectionService } from '~/domain/services'
import { BoardErrors } from '~/domain/utils'
import { LocalStorageDataRepo } from '$infra/browser/repositories'
import { BoardRepo } from '$infra/repository'

import { storeFromObservable } from './utils'

const boardRepo = new BoardRepo({
	gameStorage: new LocalStorageDataRepo({ keyName: 'game' }),
	optsStorage: new LocalStorageDataRepo({ keyName: 'options' }),
})
export const selection = new SelectionService()
export const board = new BoardService({ selectionService: selection, boardRepo })

export const selectionStore = storeFromObservable(selection)
export const boardStore = storeFromObservable(board)

export const formattedSelection = derived(selectionStore, ({ col, row }) => `${row + 1}:${col + 1}`)
export const notesStore = derived([selectionStore, boardStore], ([pos]) => {
	try {
		return board.getBox(pos).notes.value
	} catch (err) {
		if (err instanceof BoardErrors.NotInitialized) return new Notes().value
		throw err
	}
})

function createMistakeStore() {
	const { subscribe, update } = writable(0)

	const addMistake = () => {
		update(m => m + 1)
	}

	return { subscribe, addMistake }
}

export const mistakeStore = createMistakeStore()
