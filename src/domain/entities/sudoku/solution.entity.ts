import { randomNumbers } from '~/domain/utils'

type ISolution = {
	readonly value: readonly (readonly number[])[]
}

export class Solution implements ISolution {
	#board: number[][]
	#value: readonly (readonly number[])[]
	constructor() {
		this.#board = this.#createEmptyBoard()
		this.#value = this.#createSolution()
	}

	#createEmptyBoard() {
		const array: number[][] = []
		for (let i = 0; i < 9; i++) {
			array[i] = []
			for (let j = 0; j < 9; j++) array[i][j] = 0
		}
		return array
	}

	#isSafe({ row, col, num }: { row: number; col: number; num: number }): boolean {
		return (
			!this.#usedInRow({ row, num }) &&
			!this.#usedInCol({ col, num }) &&
			!this.#usedInQuadrant({ boxStartRow: row - (row % 3), boxStartCol: col - (col % 3), num })
		)
	}

	#usedInRow({ row, num }: { row: number; num: number }): boolean {
		for (let col = 0; col < 9; col++) {
			if (this.#board[row][col] === num) {
				return true
			}
		}
		return false
	}

	#usedInCol({ col, num }: { col: number; num: number }): boolean {
		for (let row = 0; row < 9; row++) {
			if (this.#board[row][col] === num) {
				return true
			}
		}
		return false
	}

	#usedInQuadrant({
		boxStartCol,
		boxStartRow,
		num,
	}: {
		boxStartRow: number
		boxStartCol: number
		num: number
	}): boolean {
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				if (this.#board[row + boxStartRow][col + boxStartCol] === num) {
					return true
				}
			}
		}
		return false
	}

	#fillBox(row: number, col: number) {
		const numbers = randomNumbers()

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				this.#board[row + i][col + j] = numbers[i * 3 + j]
			}
		}
	}
	#fillDiagonal() {
		for (let i = 0; i < 9; i += 3) {
			this.#fillBox(i, i)
		}
	}
	#fillRemaining(row: number, col: number): boolean {
		if (col >= 9 && row < 9 - 1) {
			row = row + 1
			col = 0
		}

		if (row >= 9 && col >= 9) {
			return true
		}

		if (row < 3) {
			if (col < 3) {
				col = 3
			}
		} else if (row < 9 - 3) {
			if (col === Math.floor(row / 3) * 3) {
				col = col + 3
			}
		} else {
			if (col === 9 - 3) {
				row = row + 1
				col = 0
				if (row >= 9) {
					return true
				}
			}
		}

		for (let num = 1; num <= 9; num++) {
			if (this.#isSafe({ row, col, num })) {
				this.#board[row][col] = num
				if (this.#fillRemaining(row, col + 1)) {
					return true
				}
				this.#board[row][col] = 0
			}
		}

		return false
	}
	#createSolution() {
		this.#fillDiagonal()
		this.#fillRemaining(0, 3)

		return Object.freeze(this.#board.map(row => Object.freeze(row)))
	}

	get value() {
		return this.#value
	}
}
