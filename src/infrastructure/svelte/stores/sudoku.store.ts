import { derived, writable } from 'svelte/store'

import { BoardService, SelectionService } from '~/domain/services'
import { boardErrors } from '~/domain/utils'

import { storeFromObservable } from './utils'
import { Notes } from '~/domain/entities'

export const selection = new SelectionService()
export const board = new BoardService({ selectionService: selection })

export const selectionStore = storeFromObservable(selection)
export const boardStore = storeFromObservable(board)

export const formattedSelection = derived(selectionStore, ({ col, row }) => `${row + 1}:${col + 1}`)
export const notesStore = derived([selectionStore, boardStore], ([pos]) => {
	try {
		return board.getBox(pos).notes.value
	} catch (err) {
		if (err instanceof boardErrors.NotInitialized) return new Notes().value
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
