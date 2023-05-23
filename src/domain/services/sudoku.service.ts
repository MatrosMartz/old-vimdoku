import type { SudokuModel } from '../models'

interface GetBoxValueArgs {
	column: number
	columnMultiplier: number
	row: number
	rowMultiplier: number
}

const getRowMultiplier = () => Math.trunc(1 + Math.trunc(Math.random() * 6) * 1.5)
const getColumnMultiplier = () => getRowMultiplier() * 3
function getBoxValue({ column, columnMultiplier, row, rowMultiplier }: GetBoxValueArgs) {
	return 1 + ((column * columnMultiplier + Math.floor(column / 3) * rowMultiplier + row) % 9)
}

function createArray<T>(length: number, mapFn: (index: number) => T) {
	return Array.from({ length }, (_, index) => mapFn(index))
}
function sortSudoku(sudoku: number[][]) {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	const iterations = Math.trunc(Math.random() * 7) + 3

	for (let i = 0; i < iterations; i++) {
		const replaceNumbers = [...numbers].sort(() => Math.trunc(Math.random() * 2) - 1)

		sudoku = sudoku.map(rows => rows.map(box => replaceNumbers[numbers.indexOf(box)]))
	}

	return sudoku
}
const getSimpleSudoku = () => {
	const columnMultiplier = getColumnMultiplier()
	const rowMultiplier = getRowMultiplier()

	return createArray(9, column =>
		createArray(9, row => getBoxValue({ column, columnMultiplier, row, rowMultiplier }))
	)
}

export class SudokuService implements SudokuModel {
	static getNewSudoku = () => sortSudoku(getSimpleSudoku())
	static getSectors(sudoku: number[][]) {
		const quadrants = createArray(9, () => new Set<number>())
		const columns = createArray(9, () => new Set<number>())
		const rows = createArray(9, () => new Set<number>())
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
}
