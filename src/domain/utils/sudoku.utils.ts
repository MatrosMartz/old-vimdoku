import type { Difficulties, Position } from '../models'

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
