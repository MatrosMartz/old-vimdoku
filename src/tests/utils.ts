import { get, type Readable } from 'svelte/store'
import type { BoxSchema, BoxKinds } from '~/domain/models'

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
