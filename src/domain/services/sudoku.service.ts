import {
	BoxStates,
	type BoxSchema,
	type ISudokuService,
	Difficulties,
	type Position,
} from '../models'
import {
	addNewNote,
	probabilityToBeInitial,
	createArrayMap,
	createEmptyBoard,
	randomNumbers,
	isSafe,
} from '../utils'

export class SudokuService implements ISudokuService {
	static createSolution() {
		const board = createEmptyBoard()

		function fillDiagonal() {
			for (let i = 0; i < 9; i += 3) {
				fillBox(i, i)
			}
		}

		function fillBox(row: number, col: number) {
			const numbers = randomNumbers()

			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					board[row + i][col + j] = numbers[i * 3 + j]
				}
			}
		}

		function fillRemaining(row: number, col: number): boolean {
			if (col >= 9 && row < 9 - 1) {
				row = row + 1
				col = 0
			}

			if (row >= 9 && col >= 9) {
				return true
			}

			if (row < 3) {
				if (col < 3) {
					col = 3
				}
			} else if (row < 9 - 3) {
				if (col === Math.floor(row / 3) * 3) {
					col = col + 3
				}
			} else {
				if (col === 9 - 3) {
					row = row + 1
					col = 0
					if (row >= 9) {
						return true
					}
				}
			}

			for (let num = 1; num <= 9; num++) {
				if (isSafe({ row, col, num }, board)) {
					board[row][col] = num
					if (fillRemaining(row, col + 1)) {
						return true
					}
					board[row][col] = 0
				}
			}

			return false
		}

		fillDiagonal()
		fillRemaining(0, 3)

		return board
	}
	static EMPTY_BOX_VALUE = 0
	static getSectors(sudoku: readonly number[][]) {
		const quadrants = createArrayMap(9, () => new Set<number>())
		const columns = createArrayMap(9, () => new Set<number>())
		const rows = createArrayMap(9, () => new Set<number>())
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
		sudoku = SudokuService.createSolution(),
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
					state: isInitial ? BoxStates.Initial : BoxStates.Empty,
					value: isInitial ? value : SudokuService.EMPTY_BOX_VALUE,
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
			value: SudokuService.EMPTY_BOX_VALUE,
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
