import type { BoxKinds } from '~/domain/models'
import type { BoardService } from '~/domain/services'
import { createArray } from '~/domain/utils'

export const hours = (t: number) => t * 3600_000
export const minutes = (t: number) => t * 60_000
export const seconds = (t: number) => t * 1_000

export function getBoxAndPosByKind(boardService: BoardService, kind: BoxKinds) {
	const board = boardService.getBoard()
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (board[row][col].kind === kind) return { pos: { row, col }, box: board[row][col] }
		}
	}
}

export function getSectorsForSolution(solution: readonly (readonly number[])[]) {
	const mapOfSet = { fn: () => new Set<number>() }
	const quadrants = createArray(9, mapOfSet)
	const cols = createArray(9, mapOfSet)
	const rows = createArray(9, mapOfSet)
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
