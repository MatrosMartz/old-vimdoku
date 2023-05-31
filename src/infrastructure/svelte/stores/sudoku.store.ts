import { derived, writable } from 'svelte/store'

import { Difficulties, type Position } from '~/domain/models'
import { SudokuService } from '~/domain/services'

const sudokuService = new SudokuService({ difficulty: Difficulties.Expert })

function createSudokuStore() {
	const { subscribe, set } = writable(sudokuService.getBoard())

	const addNote = (note: number) => {
		sudokuService.addNote(note)
		set(sudokuService.getBoard())
	}
	const erase = () => {
		sudokuService.writeNumber(SudokuService.EMPTY_BOX_VALUE)
		set(sudokuService.getBoard())
	}
	const move = (pos: Position) => {
		sudokuService.moveSelected(pos)
		set(sudokuService.getBoard())
	}
	const moveDown = (times?: number) => {
		sudokuService.moveDown(times)
		set(sudokuService.getBoard())
	}
	const moveLeft = (times?: number) => {
		sudokuService.moveLeft(times)
		set(sudokuService.getBoard())
	}
	const moveRight = (times?: number) => {
		sudokuService.moveRight(times)
		set(sudokuService.getBoard())
	}
	const moveUp = (times?: number) => {
		sudokuService.moveUp(times)
		set(sudokuService.getBoard())
	}
	const write = (value: number) => {
		sudokuService.writeNumber(value)
		set(sudokuService.getBoard())
	}

	return { subscribe, addNote, erase, move, moveDown, moveLeft, moveRight, moveUp, write }
}

export const sudokuStore = createSudokuStore()

export const selectedPositionStore = derived(sudokuStore, () => sudokuService.getSelectedPosition())
