import type { Difficulties } from '../models'

export function isSafe(
	{ row, col, num }: { row: number; col: number; num: number },
	board: number[][]
): boolean {
	return (
		!usedInRow({ row, num }, board) &&
		!usedInCol({ col, num }, board) &&
		!usedInBox({ boxStartRow: row - (row % 3), boxStartCol: col - (col % 3), num }, board)
	)
}

function usedInRow({ row, num }: { row: number; num: number }, board: number[][]): boolean {
	for (let col = 0; col < 9; col++) {
		if (board[row][col] === num) {
			return true
		}
	}
	return false
}

function usedInCol({ col, num }: { col: number; num: number }, board: number[][]): boolean {
	for (let row = 0; row < 9; row++) {
		if (board[row][col] === num) {
			return true
		}
	}
	return false
}

function usedInBox(
	{ boxStartCol, boxStartRow, num }: { boxStartRow: number; boxStartCol: number; num: number },
	board: number[][]
): boolean {
	for (let row = 0; row < 3; row++) {
		for (let col = 0; col < 3; col++) {
			if (board[row + boxStartRow][col + boxStartCol] === num) {
				return true
			}
		}
	}
	return false
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
