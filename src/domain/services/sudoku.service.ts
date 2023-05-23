import { BoxStates, type BoxSchema, type SudokuModel, Difficulties } from '../models'

interface GetBoxValueArgs {
	column: number
	columnMultiplier: number
	row: number
	rowMultiplier: number
}

const getRowMultiplier = () => Math.trunc(1 + Math.trunc(Math.random() * 6) * 1.5)
const getColumnMultiplier = () => getRowMultiplier() * 3
function getBoxValue({ column, columnMultiplier, row, rowMultiplier }: GetBoxValueArgs) {
	return 1 + ((column * columnMultiplier + Math.floor(column / 3) * rowMultiplier + row) % 9)
}

function createArray<T>(length: number, mapFn: (index: number) => T) {
	return Array.from({ length }, (_, index) => mapFn(index))
}
function sortSudoku(sudoku: number[][]): readonly number[][] {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	const iterations = Math.trunc(Math.random() * 7) + 3

	for (let i = 0; i < iterations; i++) {
		const replaceNumbers = [...numbers].sort(() => Math.trunc(Math.random() * 2) - 1)

		sudoku = sudoku.map(rows => rows.map(box => replaceNumbers[numbers.indexOf(box)]))
	}

	return Object.freeze(sudoku)
}
function getSimpleSudoku() {
	const columnMultiplier = getColumnMultiplier()
	const rowMultiplier = getRowMultiplier()

	return createArray(9, column =>
		createArray(9, row => getBoxValue({ column, columnMultiplier, row, rowMultiplier }))
	)
}

const probabilityToBeInitial = (difficulty: Difficulties) => !Math.trunc(Math.random() * difficulty)

export const VOID_BOX_VALUE = 0

export class SudokuService implements SudokuModel {
	static getNewSudoku = () => sortSudoku(getSimpleSudoku())
	static getSectors(sudoku: number[][] | readonly number[][]) {
		const quadrants = createArray(9, () => new Set<number>())
		const columns = createArray(9, () => new Set<number>())
		const rows = createArray(9, () => new Set<number>())
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
	static isWin(board: BoxSchema[][]) {
		return board.every(columns =>
			columns.every(box => [BoxStates.Initial, BoxStates.Correct].includes(box.state))
		)
	}
	static getFirstVoidBox(board: BoxSchema[][]) {
		for (let row = 0; row < board.length; row++) {
			for (let column = 0; column < board[row].length; column++) {
				if (board[row][column].state === BoxStates.Void) return { column, row }
			}
		}
	}

	#board: BoxSchema[][]
	#difficulty: Difficulties
	#sudoku: readonly number[][]

	constructor({
		sudoku = SudokuService.getNewSudoku(),
		difficulty = Difficulties.Basic,
	}: {
		sudoku?: readonly number[][]
		difficulty?: Difficulties
	}) {
		this.#sudoku = sudoku
		this.#difficulty = difficulty
		this.#board = this.#createBoard()
	}

	#createBoard = () =>
		this.#sudoku.map(columns =>
			columns.map<BoxSchema>(value => {
				const isInitial = probabilityToBeInitial(this.#difficulty)
				return {
					notes: [],
					selected: false,
					state: isInitial ? BoxStates.Initial : BoxStates.Void,
					value: isInitial ? value : VOID_BOX_VALUE,
				}
			})
		)
	#mapBoard(mapFn: (args: { box: BoxSchema; column: number; row: number }) => BoxSchema) {
		this.#board = this.#board.map((columns, row) =>
			columns.map((box, column) => mapFn({ box, column, row }))
		)
	}

	getBoard = () => this.#board
	moveSelected = (pos: { column: number; row: number }) =>
		this.#mapBoard(({ box, column, row }) => ({
			...box,
			selected: pos.column === column && pos.row === row,
		}))
	writeNumber = (pos: { column: number; row: number }, value: number) =>
		this.#mapBoard(({ box, column, row }) => {
			const isActual = pos.column === column && pos.row === row
			const isCorrect = this.#sudoku[column][row] === value
			const isInitial = box.state === BoxStates.Initial

			if (isInitial || !isActual) return { ...box }
			return {
				...box,
				notes: [],
				value: value,
				state: isCorrect ? BoxStates.Correct : BoxStates.Incorrect,
			}
		})
}
