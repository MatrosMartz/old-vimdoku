import { writable } from 'svelte/store'

import { type Position } from '~/domain/models'
import { BoardService, SelectionService } from '~/domain/services'

export const selection = new SelectionService()
export const board = new BoardService({ selectionService: selection })

function createBoardStore() {
	const { subscribe, set } = writable(board.getBoard())

	const addNote = (note: number) => {
		board.addNote(note)
		set(board.getBoard())
	}
	const erase = () => {
		board.writeNumber(BoardService.EMPTY_BOX_VALUE)
		set(board.getBoard())
	}
	const write = (value: number) => {
		board.writeNumber(value)
		set(board.getBoard())
	}

	return { subscribe, addNote, erase, write }
}

export const boardStore = createBoardStore()

function createSelectionStore() {
	const { subscribe, set } = writable(selection.getSelectionPosition())

	const moveTo = (pos: Position) => {
		selection.moveTo(pos)
		set(selection.getSelectionPosition())
	}
	const moveDown = (times?: number) => {
		selection.moveDown(times)
		set(selection.getSelectionPosition())
	}
	const moveLeft = (times?: number) => {
		selection.moveLeft(times)
		set(selection.getSelectionPosition())
	}
	const moveRight = (times?: number) => {
		selection.moveRight(times)
		set(selection.getSelectionPosition())
	}
	const moveUp = (times?: number) => {
		selection.moveUp(times)
		set(selection.getSelectionPosition())
	}

	return { subscribe, moveDown, moveLeft, moveRight, moveTo, moveUp }
}

export const selectionStore = createSelectionStore()
