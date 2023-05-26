import type { Difficulties } from '../models'

import { createArray } from './array.utils'

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

export function sortSudoku(sudoku: number[][]) {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	const iterations = Math.trunc(Math.random() * 7) + 3

	for (let i = 0; i < iterations; i++) {
		const replaceNumbers = [...numbers].sort(() => Math.trunc(Math.random() * 2) - 1)

		sudoku = sudoku.map(rows => rows.map(box => replaceNumbers[numbers.indexOf(box)]))
	}

	return Object.freeze(sudoku)
}
export function getSimpleSudoku() {
	const columnMultiplier = getColumnMultiplier()
	const rowMultiplier = getRowMultiplier()

	return createArray(9, column =>
		createArray(9, row => getBoxValue({ column, columnMultiplier, row, rowMultiplier }))
	)
}
export function addNewNote(notes: number[], note: number) {
	if (notes.includes(note)) return [...notes]
	return [...notes, note].sort()
}
export const probabilityToBeInitial = (difficulty: Difficulties) =>
	!Math.trunc(Math.random() * difficulty)
