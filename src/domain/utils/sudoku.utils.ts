import type { Difficulties } from '../models'

export function isAnyEmptyBox(...number: number[]) {
	return number.includes(0)
}

export function cleanRowAndCol({ board, i }: { board: number[][]; i: number }) {
	for (let k = i; k < 9; k++) {
		board[k][i] = 0
		board[i][k] = 0
	}
}

export function isSafe({
	num,
	row,
	col,
	board,
}: {
	num: number
	row: number
	col: number
	board: number[][]
}) {
	const quadrant = {
		row: (i: number) => (i % 3) + Math.trunc(row / 3) * 3,
		col: (i: number) => Math.trunc(i / 3) + Math.trunc(col / 3) * 3,
	}
	if (board[row][col] !== 0) return false

	for (let i = 0; i < 9; i++) {
		if (
			// isn't Valid in row
			board[row][i] === num ||
			// isn't Valid in col
			board[i][col] === num ||
			// isn't valid in quadrant
			board[quadrant.row(i)][quadrant.col(i)] === num
		)
			return false
	}

	return true
}

export function addNewNote(notes: number[], note: number) {
	if (notes.includes(note)) return [...notes]
	return [...notes, note].sort()
}
export const probabilityToBeInitial = (difficulty: Difficulties) =>
	!Math.trunc(Math.random() * difficulty)

export function randomNumbers() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

	for (let i = numbers.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i - 1))
		;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
	}
	return numbers
}
