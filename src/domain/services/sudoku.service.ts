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
	static MAX_BOX_POS = 8
	static MIN_BOX_POS = 0
	static getSectors(sudoku: readonly number[][]) {
		const quadrants = createArrayMap(9, () => new Set<number>())
		const cols = createArrayMap(9, () => new Set<number>())
		const rows = createArrayMap(9, () => new Set<number>())
		for (let col = 0; col < 9; col++) {
			for (let row = 0; row < 9; row++) {
				const quadrant = Math.trunc(row / 3) + Math.trunc(col / 3) * 3
				cols[col].add(sudoku[col][row])
				rows[row].add(sudoku[col][row])
				quadrants[quadrant].add(sudoku[col][row])
			}
		}
		return { quadrants, cols, rows }
	}
	static isWin(board: readonly BoxSchema[][]) {
		return board.every(cols =>
			cols.every(box => [BoxStates.Initial, BoxStates.Correct].includes(box.state))
		)
	}
	static getFirstBoxWithState(board: readonly BoxSchema[][], state: BoxStates) {
		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[row].length; col++) {
				if (board[row][col].state === state) return { col, row }
			}
		}
	}

	#board: BoxSchema[][]
	#difficulty: Difficulties
	#sudoku: readonly number[][]
	#selectedPos: Position

	constructor({
		sudoku = SudokuService.createSolution(),
		difficulty = Difficulties.Basic,
		initialPosition = { col: 0, row: 0 },
	}: {
		sudoku?: readonly number[][]
		difficulty?: Difficulties
		initialPosition?: Position
	} = {}) {
		this.#sudoku = sudoku
		this.#difficulty = difficulty
		this.#board = this.#createBoard()
		this.#selectedPos = initialPosition
	}

	#createBoard() {
		const board: BoxSchema[][] = []
		for (let row = 0; row < 9; row++) {
			board[row] = []
			for (let col = 0; col < 9; col++) {
				const isInitial = probabilityToBeInitial(this.#difficulty)
				board[row][col] = {
					notes: [],
					selected: false,
					state: isInitial ? BoxStates.Initial : BoxStates.Empty,
					value: isInitial ? this.#sudoku[row][col] : SudokuService.EMPTY_BOX_VALUE,
				}
			}
		}
		return board
	}
	#boardMap(mapFn: (args: { box: BoxSchema } & Position) => BoxSchema) {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				this.#board[row][col] = mapFn({ box: this.getBox({ col, row }), col, row })
			}
		}
	}
	#updateSelected(update: (args: { box: BoxSchema } & Position) => BoxSchema) {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				const box = this.getBox({ col, row })
				if (box.selected && box.state !== BoxStates.Initial)
					this.#board[row][col] = update({ box, col, row })
			}
		}
	}
	#isStartPosition = () =>
		this.#selectedPos.row === SudokuService.MIN_BOX_POS &&
		this.#selectedPos.col === SudokuService.MIN_BOX_POS
	#isEndPosition = () =>
		this.#selectedPos.row === SudokuService.MAX_BOX_POS &&
		this.#selectedPos.col === SudokuService.MAX_BOX_POS

	addNote(value: number) {
		this.#updateSelected(({ box }) => ({
			...box,
			value: SudokuService.EMPTY_BOX_VALUE,
			notes: addNewNote(box.notes, value),
			state: BoxStates.WhitNotes,
		}))
	}

	getBoard = (): readonly BoxSchema[][] => this.#board
	getBox = ({ col, row }: Position) => Object.freeze(this.#board[row][col])
	getSudokuValue = ({ col, row }: Position) => this.#sudoku[row][col]
	getSelectedPosition = () => this.#selectedPos

	moveSelected(pos: Position) {
		this.#boardMap(({ box, col, row }) => {
			const selected = pos.col === col && pos.row === row
			if (selected) this.#selectedPos = pos
			return { ...box, selected }
		})
	}

	moveDown(times = 1) {
		if (this.#isEndPosition()) return

		const row = this.#selectedPos.row + times
		const rowIsMax = row > SudokuService.MAX_BOX_POS
		const col = rowIsMax ? SudokuService.MAX_BOX_POS : this.#selectedPos.col

		this.moveSelected({ row: rowIsMax ? SudokuService.MAX_BOX_POS : row, col })
	}
	moveLeft(times = 1) {
		if (this.#isStartPosition()) return

		const col = this.#selectedPos.col - times
		const colIxMin = col < SudokuService.MIN_BOX_POS
		const row = this.#selectedPos.row + (colIxMin ? col : SudokuService.MIN_BOX_POS)

		this.moveSelected({
			row,
			col: colIxMin ? col + 9 : col,
		})
	}
	moveRight(times = 1) {
		if (this.#isEndPosition()) return

		const col = this.#selectedPos.col + times
		const row = this.#selectedPos.row + Math.trunc(col / 9)

		this.moveSelected({ row, col: col % 9 })
	}
	moveUp(times = 1) {
		if (this.#isStartPosition()) return

		const row = this.#selectedPos.row - times
		const rowISMin = row < SudokuService.MIN_BOX_POS
		const col = rowISMin ? SudokuService.MIN_BOX_POS : this.#selectedPos.col

		this.moveSelected({ row: rowISMin ? SudokuService.MIN_BOX_POS : row, col })
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
