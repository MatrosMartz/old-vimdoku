import {
	BoxKinds,
	type BoxSchema,
	type IBoardService,
	Difficulties,
	type Position,
	type ISelectionService,
} from '../models'
import {
	addNewNote,
	probabilityToBeInitial,
	createArrayMap,
	createEmptyBoard,
	randomNumbers,
	isSafe,
} from '../utils'

export class SelectionService implements ISelectionService {
	static MAX_BOX_POS = 8
	static MIN_BOX_POS = 0
	#position: Position

	#isEndPosition = () => this.#position.row === 8 && this.#position.col === 8
	#isStartPosition = () => this.#position.row === 0 && this.#position.col === 0

	constructor(initialPosition: Position = { col: 0, row: 0 }) {
		this.#position = initialPosition
	}

	moveDown(times = 1) {
		if (this.#isEndPosition()) return

		const row = this.#position.row + times
		const rowIsMax = row > SelectionService.MAX_BOX_POS
		const col = rowIsMax ? SelectionService.MAX_BOX_POS : this.#position.col

		this.#position = { row: rowIsMax ? SelectionService.MAX_BOX_POS : row, col }
	}
	moveLeft(times = 1) {
		if (this.#isStartPosition()) return

		const col = this.#position.col - times
		const colIxMin = col < SelectionService.MIN_BOX_POS
		const row = this.#position.row + (colIxMin ? col : SelectionService.MIN_BOX_POS)

		this.#position = {
			row,
			col: colIxMin ? col + 9 : col,
		}
	}
	moveRight(times = 1) {
		if (this.#isEndPosition()) return

		const col = this.#position.col + times
		const row = this.#position.row + Math.trunc(col / 9)

		this.#position = { row, col: col % 9 }
	}
	moveUp(times = 1) {
		if (this.#isStartPosition()) return

		const row = this.#position.row - times
		const rowISMin = row < SelectionService.MIN_BOX_POS
		const col = rowISMin ? SelectionService.MIN_BOX_POS : this.#position.col

		this.#position = { row: rowISMin ? SelectionService.MIN_BOX_POS : row, col }
	}
	moveTo(newPosition: Position) {
		this.#position = newPosition
	}
	getSelectionPosition = () => this.#position
}

export const selection = new SelectionService()

export class BoardService implements IBoardService {
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
			cols.every(box => [BoxKinds.Initial, BoxKinds.Correct].includes(box.kind))
		)
	}
	static getFirstBoxWithKind(board: readonly BoxSchema[][], kind: BoxKinds) {
		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[row].length; col++) {
				if (board[row][col].kind === kind) return { col, row }
			}
		}
	}

	#board: BoxSchema[][]
	#difficulty: Difficulties
	#sudoku: readonly number[][]
	#selectionService: SelectionService

	constructor({
		sudoku = BoardService.createSolution(),
		difficulty = Difficulties.Basic,
		selectionService = selection,
	}: {
		sudoku?: readonly number[][]
		difficulty?: Difficulties
		selectionService?: SelectionService
	} = {}) {
		this.#sudoku = sudoku
		this.#difficulty = difficulty
		this.#board = this.#createBoard()
		this.#selectionService = selectionService
	}

	#createBoard() {
		const board: BoxSchema[][] = []
		for (let row = 0; row < 9; row++) {
			board[row] = []
			for (let col = 0; col < 9; col++) {
				const isInitial = probabilityToBeInitial(this.#difficulty)
				board[row][col] = {
					notes: [],
					kind: isInitial ? BoxKinds.Initial : BoxKinds.Empty,
					value: isInitial ? this.#sudoku[row][col] : BoardService.EMPTY_BOX_VALUE,
				}
			}
		}
		return board
	}
	#updateSelected(update: (args: { box: BoxSchema } & Position) => BoxSchema) {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				const box = this.getBox({ col, row })
				if (this.isSelected({ row, col }) && box.kind !== BoxKinds.Initial)
					this.#board[row][col] = update({ box, col, row })
			}
		}
	}

	isSelected({ col, row }: Position) {
		const { col: selectedCol, row: selectedRow } = this.#selectionService.getSelectionPosition()
		return col === selectedCol && row === selectedRow
	}
	addNote(value: number) {
		this.#updateSelected(({ box }) => ({
			...box,
			value: BoardService.EMPTY_BOX_VALUE,
			notes: addNewNote(box.notes, value),
			kind: BoxKinds.WhitNotes,
		}))
	}

	getBoard = (): readonly BoxSchema[][] => this.#board
	getBox = ({ col, row }: Position) => Object.freeze(this.#board[row][col])
	getSudokuValue = ({ col, row }: Position) => this.#sudoku[row][col]

	writeNumber(value: number) {
		this.#updateSelected(({ box, ...pos }) => {
			const isCorrect = this.getSudokuValue(pos) === value
			return {
				...box,
				notes: [],
				value: value,
				kind: isCorrect ? BoxKinds.Correct : BoxKinds.Incorrect,
			}
		})
	}
}

export const board = new BoardService()
