const getColumn = (x: number) => 3 * (x + 1 + Math.trunc(x / 2))
const getRow = (x: number) => x + 1 + Math.trunc(x / 2)

const randomColumn = () => getColumn(Math.trunc(Math.random() * 6))
const randomRow = () => getRow(Math.trunc(Math.random() * 6))

export function createSudoku() {
	const columnMultiplier = randomColumn()
	const rowMultiplier = randomRow()

	let sudoku = Array.from({ length: 9 }, (_, column) =>
		Array.from(
			{ length: 9 },
			(_, row) =>
				1 + ((column * columnMultiplier + Math.floor(column / 3) * rowMultiplier + row) % 9)
		)
	)

	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

	const iterations = Math.trunc(Math.random() * 7) + 3

	for (let i = 0; i < iterations; i++) {
		const replaceNumbers = [...numbers].sort(() => Math.trunc(Math.random() * 2) - 1)

		sudoku = sudoku.map(rows => rows.map(box => replaceNumbers[numbers.indexOf(box)]))
	}

	return sudoku
}
