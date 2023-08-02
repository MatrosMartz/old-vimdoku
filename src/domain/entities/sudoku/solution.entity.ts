import type { Position } from '~/domain/models'
import {
	BoardErrors,
	createMatrix,
	deepFreeze,
	isCorrectSolution,
	quadrant,
	randomNumbers,
} from '~/domain/utils'

export type SolutionValue = readonly (readonly number[])[]

type ISolution = {
	readonly value: SolutionValue
}

export class Solution implements ISolution {
	#value: number[][]

	constructor({ initialSolution }: { initialSolution?: SolutionValue } = {}) {
		if (initialSolution != null) {
			if (!isCorrectSolution(initialSolution)) throw new BoardErrors.InvalidSolution()

			this.#value = initialSolution as number[][]
		} else {
			this.#value = createMatrix(9, { value: 0 })
			this.#fillSudoku()
		}
	}

	get value() {
		return deepFreeze(this.#value)
	}

	#fillSudoku() {
		for (let i = 0; i < 9; i++) {
			const retry = () => {
				this.#value = createMatrix(9, { value: 0 })
				i = -1
			}
			for (let j = i; j < 9; j++) {
				const numbers = randomNumbers()
				for (const num of numbers)
					if (this.#isSafe(num, { row: i, col: j })) this.#value[i][j] = num
				for (const num of numbers.reverse())
					if (this.#isSafe(num, { row: j, col: i })) this.#value[j][i] = num

				if (this.#value[i][j] === 0 || this.#value[j][i] === 0) {
					retry()
					break
				}
			}
		}
	}

	#isSafe(num: number, { row, col }: Position) {
		if (this.#value[row][col] !== 0) return false

		for (let i = 0; i < 9; i++) {
			if (this.#value[row][i] === num) return false
			if (this.#value[i][col] === num) return false
			if (this.#value[quadrant.row(i, row)][quadrant.col(i, col)] === num) return false
		}

		return true
	}
}
