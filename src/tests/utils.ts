import type { BoxKinds } from '~/domain/models'
import type { BoardService } from '~/domain/services'

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

const colors: Record<number, string> = {
	0: '\x1b[38;2;220;200;200m0\x1b[0m',
	1: '\x1b[38;2;255;140;140m1\x1b[0m',
	2: '\x1b[38;2;255;200;140m2\x1b[0m',
	3: '\x1b[38;2;255;255;140m3\x1b[0m',
	4: '\x1b[38;2;180;255;140m4\x1b[0m',
	5: '\x1b[38;2;140;255;200m5\x1b[0m',
	6: '\x1b[38;2;140;255;255m6\x1b[0m',
	7: '\x1b[38;2;140;200;255m7\x1b[0m',
	8: '\x1b[38;2;140;140;255m8\x1b[0m',
	9: '\x1b[38;2;200;140;255m9\x1b[0m',
}

export function printSudoku(sudoku: ReadonlyArray<readonly number[]>) {
	let a = '\n'

	for (let columns = 0; columns < 9; columns++) {
		for (let rows = 0; rows < 9; rows++) {
			a += (colors[sudoku[columns][rows]] ?? sudoku[columns][rows]) + ' '
			if ([2, 5].includes(rows)) a += '| '
		}
		a += '\n'
		if ([2, 5].includes(columns)) a += '- - - + - - - + - - -\n'
	}

	console.log(a)
}
