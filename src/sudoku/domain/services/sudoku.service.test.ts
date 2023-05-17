import { getSectors } from '~/tests/utils'

import { sudokuService } from './sudoku.service'

describe('Create Sudoku', () => {
	const sudoku = sudokuService.create()

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
		const { columns, quadrants, rows } = getSectors(sudoku)
		test.concurrent.each([
			{ name: 'columns', actual: columns },
			{ name: 'quadrants', actual: quadrants },
			{ name: 'rows', actual: rows },
		])('$name should be contain only different numbers', ({ actual }) => {
			expect(actual.every(value => value.size === 9)).toBe(true)
		})
	})
})
