import { beforeEach, describe, expect, test } from 'vitest'

import { BoardService, SelectionService } from './sudoku.service'
import { BoxKinds, type BoxSchema, type Position } from '../models'

const sudoku = BoardService.createSolution()

describe('Create Sudoku', () => {
	test.concurrent('Should return array', () => {
		expect(Array.isArray(sudoku)).toBe(true)
	})
	test.concurrent('Should be array length is 9', () => {
		expect(sudoku).toHaveLength(9)
	})
	test.concurrent('The length of columns should be nine', () => {
		expect(sudoku.every(col => col.length === 9)).toBe(true)
	})
	test.concurrent('All boxes should be numbers', () => {
		expect(sudoku.every(col => col.every(box => typeof box === 'number'))).toBe(true)
	})
	test.concurrent('All boxes should be contain numbers from one to nine', () => {
		expect(sudoku.every(col => col.every(box => 0 < box && box < 10))).toBe(true)
	})

	describe('sudoku are correct', () => {
		const { cols, quadrants, rows } = BoardService.getSectors(sudoku)
		test.concurrent.each([
			{ name: 'columns', actual: cols },
			{ name: 'quadrants', actual: quadrants },
			{ name: 'rows', actual: rows },
		])('$name should be contain only different numbers', ({ actual }) => {
			expect(actual.every(value => value.size === 9)).toBe(true)
		})
	})
})

describe('Sudoku Board', () => {
	let board: BoardService, selection: SelectionService
	const standardBox: BoxSchema = {
		notes: [],
		kind: BoxKinds.Empty,
		value: BoardService.EMPTY_BOX_VALUE,
	}

	beforeEach(() => {
		selection = new SelectionService()
		board = new BoardService({ sudoku, selectionService: selection })
	})

	test.concurrent('Not all box should be initials', () => {
		expect(board.getBoard().every(col => col.every(box => box.kind === BoxKinds.Initial))).toBe(
			false
		)
	})

	describe('Write Number', () => {
		test.concurrent('Should change the status to incorrect', () => {
			const initialBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Initial)!
			const correctValue = board.getSudokuValue(initialBoxPos)
			const incorrectValue = correctValue > 9 ? 1 : correctValue + 1

			selection.moveTo(initialBoxPos)
			board.writeNumber(incorrectValue)

			const box = board.getBox(initialBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				kind: BoxKinds.Initial,
				value: correctValue,
			})
		})
		test.concurrent('Should change the status to incorrect', () => {
			const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!
			const correctValue = board.getSudokuValue(voidBoxPos)
			const incorrectValue = correctValue > 9 ? 1 : correctValue + 1

			selection.moveTo(voidBoxPos)
			board.writeNumber(incorrectValue)

			const box = board.getBox(voidBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				kind: BoxKinds.Incorrect,
				value: incorrectValue,
			})
		})
		test.concurrent('Should change the status to correct', () => {
			const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!
			const correctValue = board.getSudokuValue(voidBoxPos)

			selection.moveTo(voidBoxPos)
			board.writeNumber(correctValue)

			const box = board.getBox(voidBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				kind: BoxKinds.Correct,
				value: correctValue,
			})
		})
		test.concurrent('should reset notes', () => {
			const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!
			const correctValue = board.getSudokuValue(voidBoxPos)

			selection.moveTo(voidBoxPos)
			board.addNote(1)
			board.writeNumber(correctValue)

			const box = board.getBox(voidBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				kind: BoxKinds.Correct,
				value: correctValue,
			})
		})
	})

	describe('Add Notes', () => {
		test.concurrent('Should change the status to notes', () => {
			const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!

			selection.moveTo(voidBoxPos)
			board.addNote(1)

			const box = board.getBox(voidBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				kind: BoxKinds.WhitNotes,
				notes: [1],
			})
		})
	})
	test.concurrent('should arrange the notes correctly', () => {
		const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!

		selection.moveTo(voidBoxPos)
		board.addNote(3)
		board.addNote(9)
		board.addNote(1)
		board.addNote(2)

		const box = board.getBox(voidBoxPos)
		expect(box).toMatchObject<BoxSchema>({
			...standardBox,
			kind: BoxKinds.WhitNotes,
			notes: [1, 2, 3, 9],
		})
	})
	test.concurrent('should not repeat notes', () => {
		const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!

		selection.moveTo(voidBoxPos)
		board.addNote(1)
		board.addNote(1)

		const box = board.getBox(voidBoxPos)
		expect(box).toMatchObject<BoxSchema>({
			...standardBox,
			kind: BoxKinds.WhitNotes,
			notes: [1],
		})
	})
	test.concurrent('should reset value', () => {
		const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!

		selection.moveTo(voidBoxPos)
		board.writeNumber(9)
		board.addNote(1)
		board.addNote(1)

		const box = board.getBox(voidBoxPos)
		expect(box).toMatchObject<BoxSchema>({
			...standardBox,
			kind: BoxKinds.WhitNotes,
			notes: [1],
		})
	})
})

describe('selection Move', () => {
	let selection: SelectionService

	beforeEach(() => {
		selection = new SelectionService()
	})

	describe.concurrent('Left', () => {
		test.concurrent('should move to the left', () => {
			const initialPosition: Position = { col: 8, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveLeft()
			const actualPosition = selection.getSelectionPosition()

			expect(actualPosition).toEqual<Position>({ col: 7, row: 0 })
		})
		test.concurrent('should move to the left and up column', () => {
			const initialPosition: Position = { col: 0, row: 8 }
			selection.moveTo(initialPosition)
			selection.moveLeft()
			const actualPosition = selection.getSelectionPosition()

			expect(actualPosition).toEqual<Position>({ col: 8, row: 7 })
		})
		test.concurrent('should not move to the left if column and row are zero', () => {
			const initialPosition: Position = { col: 0, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveLeft()
			const actualPosition = selection.getSelectionPosition()

			expect(actualPosition).toEqual<Position>({ col: 0, row: 0 })
		})
	})

	describe.concurrent('Right', () => {
		test.concurrent('should move to the right', () => {
			const initialPosition: Position = { col: 0, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveRight()
			const actualPosition = selection.getSelectionPosition()

			expect(actualPosition).toEqual<Position>({ col: 1, row: 0 })
		})
		test.concurrent('should move to the right and down column', () => {
			const initialPosition: Position = { col: 8, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveRight()
			const actualPosition = selection.getSelectionPosition()

			expect(actualPosition).toEqual<Position>({ col: 0, row: 1 })
		})

		test.concurrent('should not move to the right if column and row are 8', () => {
			const initialPosition: Position = { col: 8, row: 8 }
			selection.moveTo(initialPosition)
			selection.moveRight()
			const actualPosition = selection.getSelectionPosition()

			expect(actualPosition).toEqual<Position>({ col: 8, row: 8 })
		})
	})

	describe.concurrent('Down', () => {
		test.concurrent('should move to the down', () => {
			const initialPosition: Position = { col: 0, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveDown()
			const actualPosition = selection.getSelectionPosition()

			expect(actualPosition).toEqual<Position>({ col: 0, row: 1 })
		})
		test.concurrent('should move to the end if column is 8 ', () => {
			const initialPosition: Position = { col: 0, row: 8 }
			selection.moveTo(initialPosition)
			selection.moveDown()
			const actualPosition = selection.getSelectionPosition()

			expect(actualPosition).toEqual<Position>({ col: 8, row: 8 })
		})

		test.concurrent('should not move to the down if column and row are 8', () => {
			const initialPosition: Position = { col: 8, row: 8 }
			selection.moveTo(initialPosition)
			selection.moveDown()
			const actualPosition = selection.getSelectionPosition()

			expect(actualPosition).toEqual<Position>({ col: 8, row: 8 })
		})
	})

	describe.concurrent('Up', () => {
		test.concurrent('should move to the up', () => {
			const initialPosition: Position = { col: 8, row: 8 }
			selection.moveTo(initialPosition)
			selection.moveUp()
			const actualPosition = selection.getSelectionPosition()

			expect(actualPosition).toEqual<Position>({ col: 8, row: 7 })
		})
		test.concurrent('should move to the start if column is 0', () => {
			const initialPosition: Position = { col: 8, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveUp()
			const actualPosition = selection.getSelectionPosition()

			expect(actualPosition).toEqual<Position>({ col: 0, row: 0 })
		})

		test.concurrent('should not move to the up if column and row are 0', () => {
			const initialPosition: Position = { col: 0, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveUp()
			const actualPosition = selection.getSelectionPosition()

			expect(actualPosition).toEqual<Position>({ col: 0, row: 0 })
		})
	})
})
