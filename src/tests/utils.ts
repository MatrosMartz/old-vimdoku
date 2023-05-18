const CreateEmptyArray = (length: number) => Array.from({ length }, () => new Set<number>())

export function getSectors(sudoku: number[][]) {
	const quadrants = CreateEmptyArray(9)
	const columns = CreateEmptyArray(9)
	const rows = CreateEmptyArray(9)
	for (let column = 0; column < 9; column++) {
		for (let row = 0; row < 9; row++) {
			const quadrant = Math.trunc(row / 3) + Math.trunc(column / 3) * 3
			columns[column].add(sudoku[column][row])
			rows[row].add(sudoku[column][row])
			quadrants[quadrant].add(sudoku[column][row])
		}
	}
	return { quadrants, columns, rows }
}

export const hours = (t: number) => t * 3600_000
export const minutes = (t: number) => t * 60_000
export const seconds = (t: number) => t * 1_000
