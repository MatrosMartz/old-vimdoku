import { beforeEach, describe, expect, test } from 'vitest'

import { SudokuService } from './sudoku.service'
import { BoxStates, type BoxSchema } from '../models'

const sudoku = SudokuService.createSolution()

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
		const { cols, quadrants, rows } = SudokuService.getSectors(sudoku)
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
	let board: SudokuService
	const standardBox: BoxSchema = {
		notes: [],
		selected: true,
		state: BoxStates.Empty,
		value: SudokuService.EMPTY_BOX_VALUE,
	}

	beforeEach(() => {
		board = new SudokuService({ sudoku })
	})

	test.concurrent('Not all box should be initials', () => {
		expect(board.getBoard().every(col => col.every(box => box.state === BoxStates.Initial))).toBe(
			false
		)
	})

	describe('Write Number', () => {
		test.concurrent('Should change the status to incorrect', () => {
			const initialBoxPos = SudokuService.getFirstBoxWithState(board.getBoard(), BoxStates.Initial)!
			const correctValue = board.getSudokuValue(initialBoxPos)
			const incorrectValue = correctValue > 9 ? 1 : correctValue + 1

			board.moveSelected(initialBoxPos)
			board.writeNumber(incorrectValue)

			const box = board.getBox(initialBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				state: BoxStates.Initial,
				value: correctValue,
			})
		})
		test.concurrent('Should change the status to incorrect', () => {
			const voidBoxPos = SudokuService.getFirstBoxWithState(board.getBoard(), BoxStates.Empty)!
			const correctValue = board.getSudokuValue(voidBoxPos)
			const incorrectValue = correctValue > 9 ? 1 : correctValue + 1

			board.moveSelected(voidBoxPos)
			board.writeNumber(incorrectValue)

			const box = board.getBox(voidBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				state: BoxStates.Incorrect,
				value: incorrectValue,
			})
		})
		test.concurrent('Should change the status to correct', () => {
			const voidBoxPos = SudokuService.getFirstBoxWithState(board.getBoard(), BoxStates.Empty)!
			const correctValue = board.getSudokuValue(voidBoxPos)

			board.moveSelected(voidBoxPos)
			board.writeNumber(correctValue)

			const box = board.getBox(voidBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				state: BoxStates.Correct,
				value: correctValue,
			})
		})
		test.concurrent('should reset notes', () => {
			const voidBoxPos = SudokuService.getFirstBoxWithState(board.getBoard(), BoxStates.Empty)!
			const correctValue = board.getSudokuValue(voidBoxPos)

			board.moveSelected(voidBoxPos)
			board.addNote(1)
			board.writeNumber(correctValue)

			const box = board.getBox(voidBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				state: BoxStates.Correct,
				value: correctValue,
			})
		})
	})

	describe('Add Notes', () => {
		test.concurrent('Should change the status to notes', () => {
			const voidBoxPos = SudokuService.getFirstBoxWithState(board.getBoard(), BoxStates.Empty)!

			board.moveSelected(voidBoxPos)
			board.addNote(1)

			const box = board.getBox(voidBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				state: BoxStates.WhitNotes,
				notes: [1],
			})
		})
	})
	test.concurrent('should arrange the notes correctly', () => {
		const voidBoxPos = SudokuService.getFirstBoxWithState(board.getBoard(), BoxStates.Empty)!

		board.moveSelected(voidBoxPos)
		board.addNote(3)
		board.addNote(9)
		board.addNote(1)
		board.addNote(2)

		const box = board.getBox(voidBoxPos)
		expect(box).toMatchObject<BoxSchema>({
			...standardBox,
			state: BoxStates.WhitNotes,
			notes: [1, 2, 3, 9],
		})
	})
	test.concurrent('should not repeat notes', () => {
		const voidBoxPos = SudokuService.getFirstBoxWithState(board.getBoard(), BoxStates.Empty)!

		board.moveSelected(voidBoxPos)
		board.addNote(1)
		board.addNote(1)

		const box = board.getBox(voidBoxPos)
		expect(box).toMatchObject<BoxSchema>({
			...standardBox,
			state: BoxStates.WhitNotes,
			notes: [1],
		})
	})
	test.concurrent('should reset value', () => {
		const voidBoxPos = SudokuService.getFirstBoxWithState(board.getBoard(), BoxStates.Empty)!

		board.moveSelected(voidBoxPos)
		board.writeNumber(9)
		board.addNote(1)
		board.addNote(1)

		const box = board.getBox(voidBoxPos)
		expect(box).toMatchObject<BoxSchema>({
			...standardBox,
			state: BoxStates.WhitNotes,
			notes: [1],
		})
	})
})
