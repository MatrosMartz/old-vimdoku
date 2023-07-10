import { get, type Readable } from 'svelte/store'

import type { BoxSchema, BoxKinds } from '~/domain/models'
import { createArrayMap } from '~/domain/utils'

export const hours = (t: number) => t * 3600_000
export const minutes = (t: number) => t * 60_000
export const seconds = (t: number) => t * 1_000

export function getBoxAndPosByKind(boardStore: Readable<readonly BoxSchema[][]>, kind: BoxKinds) {
	const board = get(boardStore)
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (board[row][col].kind === kind) return { pos: { row, col }, box: board[row][col] }
		}
	}
}

export function getSectorsForSolution(solution: readonly (readonly number[])[]) {
	const quadrants = createArrayMap(9, () => new Set<number>())
	const cols = createArrayMap(9, () => new Set<number>())
	const rows = createArrayMap(9, () => new Set<number>())
	for (let col = 0; col < 9; col++) {
		for (let row = 0; row < 9; row++) {
			const quadrant = Math.trunc(row / 3) + Math.trunc(col / 3) * 3
			cols[col].add(solution[col][row])
			rows[row].add(solution[col][row])
			quadrants[quadrant].add(solution[col][row])
		}
	}
	return { quadrants, cols, rows }
}
