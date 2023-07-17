import { derived, writable } from 'svelte/store'

import { BoardService, SelectionService } from '~/domain/services'

import { storeFromObservable } from './utils'

export const selection = new SelectionService()
export const board = new BoardService({ selectionService: selection })

export const selectionStore = storeFromObservable(selection)
export const boardStore = storeFromObservable(board)

export const formattedSelection = derived(selectionStore, ({ col, row }) => `${row + 1}:${col + 1}`)

function createMistakeStore() {
	const { subscribe, update } = writable(0)

	const addMistake = () => {
		update(m => m + 1)
	}

	return { subscribe, addMistake }
}

export const mistakeStore = createMistakeStore()
