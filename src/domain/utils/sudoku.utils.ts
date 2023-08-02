import { Notes, type SolutionValue } from '../entities'
import {
	BoxKinds,
	type BoardOpts,
	type BoxSchema,
	type Difficulties,
	type Position,
} from '../models'
import { BoardService } from '../services'

import { createArray } from './array.utils'

export const probabilityToBeInitial = (difficulty: Difficulties) =>
	!Math.trunc(Math.random() * difficulty)

export function randomNumbers() {
	const numbers = createArray(9, { fn: i => i + 1 })

	for (let i = numbers.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i - 1))
		;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
	}
	return numbers
}

const [rows, cols] = [createArray(9, { fn: i => i }), createArray(9, { fn: i => i })]
export function boardEach(fn: (pos: Position) => void) {
	for (const row of rows) for (const col of cols) fn({ row, col })
}

export function isCorrectSolution(solution: SolutionValue) {
	const rows = createArray(9, { fn: () => new Set<number>() })
	const cols = createArray(9, { fn: () => new Set<number>() })
	const quadrants = createArray(9, { fn: () => new Set<number>() })
	boardEach(({ row, col }) => {
		const value = solution[row][col]
		if (value <= 0 || value >= 10) return
		const quadrant = Math.trunc(row / 3) + Math.trunc(col / 3) * 3

		rows[row].add(value)
		cols[col].add(value)
		quadrants[quadrant].add(value)
	})

	const sizeIsNine = (set: Set<number>) => set.size === 9

	return rows.every(sizeIsNine) && cols.every(sizeIsNine) && quadrants.every(sizeIsNine)
}

export function createBoard({ difficulty, solution }: BoardOpts) {
	const boardValue: BoxSchema[][] = []
	for (let row = 0; row < 9; row++) {
		boardValue[row] = []
		for (let col = 0; col < 9; col++) {
			const isInitial = probabilityToBeInitial(difficulty)
			const kind = isInitial ? BoxKinds.Initial : BoxKinds.Empty
			const value = isInitial ? solution.value[row][col] : BoardService.EMPTY_BOX_VALUE

			boardValue[row][col] = { notes: new Notes(), kind, value }
		}
	}
	return boardValue
}

export const quadrant = {
	row: (i: number, row: number) => (i % 3) + Math.trunc(row / 3) * 3,
	col: (i: number, col: number) => Math.trunc(i / 3) + Math.trunc(col / 3) * 3,
}
