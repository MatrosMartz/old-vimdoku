import { beforeEach, describe, expect, test } from 'vitest'

import { SudokuService } from './sudoku.service'
import { BoxStates, type BoxSchema } from '../models'

describe('Create Sudoku', () => {
	const sudoku = SudokuService.getNewSudoku()

	test.concurrent('Should return array', () => {
		expect(Array.isArray(sudoku)).toBe(true)
	})
	test.concurrent('Should be array length is 9', () => {
		expect(sudoku).toHaveLength(9)
	})
	test.concurrent('The length of columns should be nine', () => {
		expect(sudoku.every(column => column.length === 9)).toBe(true)
	})
	test.concurrent('All boxes should be numbers', () => {
		expect(sudoku.every(column => column.every(box => typeof box === 'number'))).toBe(true)
	})
	test.concurrent('All boxes should be contain numbers from one to nine', () => {
		expect(sudoku.every(column => column.every(box => 0 < box && box < 10))).toBe(true)
	})

	describe('sudoku are correct', () => {
		const { columns, quadrants, rows } = SudokuService.getSectors(sudoku)
		test.concurrent.each([
			{ name: 'columns', actual: columns },
			{ name: 'quadrants', actual: quadrants },
			{ name: 'rows', actual: rows },
		])('$name should be contain only different numbers', ({ actual }) => {
			expect(actual.every(value => value.size === 9)).toBe(true)
		})
	})
})

describe('Sudoku Board', () => {
	const sudoku = SudokuService.getNewSudoku()
	let board: SudokuService
	const standardBox: BoxSchema = {
		notes: [],
		selected: true,
		state: BoxStates.Void,
		value: 0,
	}

	beforeEach(() => {
		board = new SudokuService({ sudoku })
	})

	test.concurrent('Not all box should be initials', () => {
		expect(
			board.getBoard().every(columns => columns.every(box => box.state === BoxStates.Initial))
		).toBe(false)
	})
	test.concurrent('Should change the status to incorrect', () => {
		const voidBoxPos = SudokuService.getFirstVoidBox(board.getBoard())!
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
		const voidBoxPos = SudokuService.getFirstVoidBox(board.getBoard())!
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
})
