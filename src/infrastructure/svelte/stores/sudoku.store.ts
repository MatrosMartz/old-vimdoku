import { writable } from 'svelte/store'

import type { Position } from '~/domain/models'
import { SudokuService } from '~/domain/services'

function createSudokuStore() {
	const sudokuService = new SudokuService()
	const { subscribe, set } = writable(sudokuService.getBoard())

	const addNote = (note: number) => {
		sudokuService.addNote(note)
		set(sudokuService.getBoard())
	}
	const erase = () => {
		sudokuService.writeNumber(SudokuService.VOID_BOX_VALUE)
		set(sudokuService.getBoard())
	}
	const move = (pos: Position) => {
		sudokuService.moveSelected(pos)
		set(sudokuService.getBoard())
	}
	const write = (value: number) => {
		sudokuService.writeNumber(value)
		set(sudokuService.getBoard())
	}

	return { subscribe, addNote, erase, move, write }
}

export const sudokuStore = createSudokuStore()

function createBoxSelectedStore() {
	const { subscribe, update } = writable<Position>({ column: 0, row: 0 })

	const moveDown = (times = 1) =>
		update(({ column, row }) => {
			const newColumn = column + times
			const newRow = row + Math.trunc(newColumn / 10)
			return {
				row: newRow % 10,
				column: newColumn % 10,
			}
		})
	const moveLeft = (times = 1) =>
		update(({ column, row }) => {
			const newRow = row - times
			const newColumn = column - Math.trunc(newRow / 10)
			return {
				column: (newColumn % 10) + newColumn < 0 ? 10 : 0,
				row: (newRow % 10) + newRow < 0 ? 10 : 0,
			}
		})
	const moveRight = (times = 1) =>
		update(({ column, row }) => {
			const newRow = row + times
			const newColumn = column + Math.trunc(newRow / 10)
			return {
				column: newColumn % 10,
				row: newRow % 10,
			}
		})
	const moveUp = (times = 1) =>
		update(({ column, row }) => {
			const newColumn = column - times
			const newRow = row - Math.trunc(newColumn / 10)
			return {
				row: (newRow % 10) + newRow < 0 ? 10 : 0,
				column: (newColumn % 10) + newColumn < 0 ? 10 : 0,
			}
		})

	return { subscribe, moveDown, moveLeft, moveRight, moveUp }
}

export const boxSelectedStore = createBoxSelectedStore()