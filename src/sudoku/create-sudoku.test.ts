import { describe, test, expect } from 'vitest'

import { createSudoku } from './create-sudoku'

const CreateEmptyArray = (length: number) => Array.from({ length }, () => new Set<number>())

function getSectors(sudoku: number[][]) {
	const quadrants = CreateEmptyArray(9)
	const columns = CreateEmptyArray(9)
	const rows = CreateEmptyArray(9)
	for (let column = 0; column < 9; column++) {
		for (let row = 0; row < 9; row++) {
			const quadrant = Math.trunc(row / 3) + Math.trunc(column / 3) * 3
			columns[column].add(sudoku[column][row])
			rows[row].add(sudoku[column][row])
			quadrants[quadrant].add(sudoku[column][row])
		}
	}
	return { quadrants, columns, rows }
}

describe('Create Sudoku', () => {
	test.concurrent('Should be not null', () => {
		expect(createSudoku).not.toBeUndefined()
	})

	const sudoku = createSudoku()

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
