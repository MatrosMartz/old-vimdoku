import { BoxStates, type BoxSchema, type SudokuModel, Difficulties, type Position } from '../models'

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
function sortSudoku(sudoku: number[][]) {
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
function addNewNote(notes: number[], note: number) {
	if (notes.includes(note)) return [...notes]
	return [...notes, note].sort()
}

export class SudokuService implements SudokuModel {
	static VOID_BOX_VALUE = 0
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
	static getFirstBoxWithState(board: BoxSchema[][] | readonly BoxSchema[][], state: BoxStates) {
		for (let row = 0; row < board.length; row++) {
			for (let column = 0; column < board[row].length; column++) {
				if (board[row][column].state === state) return { column, row }
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
					value: isInitial ? value : SudokuService.VOID_BOX_VALUE,
				}
			})
		)
	#boardMap(mapFn: (args: { box: BoxSchema } & Position) => BoxSchema) {
		this.#board = this.#board.map((columns, row) =>
			columns.map((box, column) => mapFn({ box, column, row }))
		)
	}
	#updateSelected(update: (args: { box: BoxSchema } & Position) => BoxSchema) {
		this.#boardMap(args =>
			!args.box.selected || args.box.state === BoxStates.Initial ? { ...args.box } : update(args)
		)
	}

	addNote(value: number) {
		this.#updateSelected(({ box }) => ({
			...box,
			value: SudokuService.VOID_BOX_VALUE,
			notes: addNewNote(box.notes, value),
			state: BoxStates.WhitNotes,
		}))
	}
	getBoard = (): readonly BoxSchema[][] => this.#board
	getBox = ({ column, row }: Position) => Object.freeze(this.#board[row][column])
	getSudokuValue = ({ column, row }: Position) => this.#sudoku[row][column]
	moveSelected(pos: Position) {
		this.#boardMap(({ box, column, row }) => ({
			...box,
			selected: pos.column === column && pos.row === row,
		}))
	}
	writeNumber(value: number) {
		this.#updateSelected(({ box, ...pos }) => {
			const isCorrect = this.getSudokuValue(pos) === value
			return {
				...box,
				notes: [],
				value: value,
				state: isCorrect ? BoxStates.Correct : BoxStates.Incorrect,
			}
		})
	}
}
