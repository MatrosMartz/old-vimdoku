import {
	BoxStates,
	type BoxSchema,
	type ISudokuService,
	Difficulties,
	type Position,
} from '../models'
import {
	addNewNote,
	createArray,
	getSimpleSudoku,
	probabilityToBeInitial,
	sortSudoku,
} from '../utils'

export class SudokuService implements ISudokuService {
	static VOID_BOX_VALUE = 0
	static getNewSudoku = () => sortSudoku(getSimpleSudoku())
	static getSectors(sudoku: readonly number[][]) {
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
	static isWin(board: readonly BoxSchema[][]) {
		return board.every(columns =>
			columns.every(box => [BoxStates.Initial, BoxStates.Correct].includes(box.state))
		)
	}
	static getFirstBoxWithState(board: readonly BoxSchema[][], state: BoxStates) {
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
	} = {}) {
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
