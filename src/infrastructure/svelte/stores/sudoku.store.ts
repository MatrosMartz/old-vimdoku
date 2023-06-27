import { derived, readable, writable } from 'svelte/store'

import { type BoxSchema, type Position } from '~/domain/models'
import { BoardService, SelectionService } from '~/domain/services'
import type { Observer } from '~/domain/utils'

export const selection = new SelectionService()
export const board = new BoardService({ selectionService: selection })

export const boardStore = readable(board.getValue(), set => {
	const observer: Observer<BoxSchema[][]> = {
		update: value => set(value),
	}
	board.addObserver(observer)

	return () => board.removeObserver(observer)
})

export const selectionStore = readable(selection.getValue(), set => {
	const observer: Observer<Position> = {
		update: value => set(value),
	}
	selection.addObserver(observer)

	return () => selection.removeObserver(observer)
})
export const formattedSelection = derived(selectionStore, ({ col, row }) => `${row + 1}:${col + 1}`)

function createMistakeStore() {
	const { subscribe, update } = writable(0)

	const addMistake = () => {
		update(m => m + 1)
	}

	return { subscribe, addMistake }
}

export const mistakeStore = createMistakeStore()
