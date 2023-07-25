import {
	BoxKinds,
	type BoxSchema,
	type IBoardService,
	Difficulties,
	type Position,
	type BoardSchema,
	type BoardValue,
} from '~/domain/models'
import { probabilityToBeInitial, type Observer, boardEach, boardErrors } from '~/domain/utils'
import { Notes, Solution } from '~/domain/entities'

import { SelectionService } from './selection.service'

export class BoardService implements IBoardService {
	static EMPTY_BOX_VALUE = 0
	static isWin(board: readonly BoxSchema[][]) {
		return board.every(cols =>
			cols.every(box => [BoxKinds.Initial, BoxKinds.Correct].includes(box.kind))
		)
	}
	static getFirstBoxWithKind(board: BoardSchema, kind: BoxKinds) {
		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[row].length; col++) {
				if (board[row][col].kind === kind) return { col, row }
			}
		}
	}

	#opts: { difficulty: Difficulties; solution: Solution } | null
	#selectionService: SelectionService
	#value: { hasBoard: true; board: BoxSchema[][] } | { hasBoard: false }
	#observers: Observer<BoardValue>[] = []

	constructor({
		selectionService = new SelectionService(),
	}: {
		selectionService?: SelectionService
	} = {}) {
		this.#opts = null
		this.#value = { hasBoard: false }
		this.#selectionService = selectionService
	}
	hasBoard = () => this.#value.hasBoard
	#boardFreeze() {
		if (!this.#value.hasBoard) return this.#value

		const { board } = this.#value
		const freezeBox = (box: BoxSchema) => Object.freeze({ ...box })
		const freezeCol = (col: readonly BoxSchema[]) => Object.freeze(col.map(freezeBox))
		return { ...this.#value, board: Object.freeze(board.map(freezeCol)) }
	}
	#notifyObservers() {
		const immutableBoard = this.#boardFreeze()
		this.#observers.forEach(obs => obs.update(immutableBoard))
	}
	addObserver(observer: Observer<BoardValue>) {
		this.#observers = [...this.#observers, observer]
	}
	removeObserver(observer: Observer<BoardValue>) {
		this.#observers = this.#observers.filter(obs => obs !== observer)
	}
	get value() {
		return this.#boardFreeze()
	}

	#createBoard({ difficulty, solution }: { difficulty: Difficulties; solution: Solution }) {
		const boardValue: BoxSchema[][] = []
		for (let row = 0; row < 9; row++) {
			boardValue[row] = []
			for (let col = 0; col < 9; col++) {
				const isInitial = probabilityToBeInitial(difficulty)
				const kind = isInitial ? BoxKinds.Initial : BoxKinds.Empty
				const value = isInitial ? solution.value[row][col] : BoardService.EMPTY_BOX_VALUE

				boardValue[row][col] = { notes: new Notes(), kind, value }
			}
		}
		return boardValue
	}
	#updateSelected(update: (args: { box: BoxSchema } & Position) => BoxSchema) {
		boardEach(({ row, col }) => {
			if (!this.#value.hasBoard) throw new boardErrors.NotInitialized()
			const box = this.getBox({ row, col })
			if (this.isSelected({ row, col }) && box.kind !== BoxKinds.Initial)
				this.#value.board[row][col] = update({ box, row, col })
		})

		this.#notifyObservers()
	}
	#isCorrect({ value, pos }: { value: number; pos: Position }) {
		return this.getSudokuValue(pos) === value
	}

	initBoard({
		difficulty = Difficulties.Easy,
		solution = new Solution(),
	}: { difficulty?: Difficulties; solution?: Solution } = {}) {
		setTimeout(() => {
			this.#opts = { difficulty, solution }
			this.#value = { hasBoard: true, board: this.#createBoard(this.#opts) }
			this.#notifyObservers()
		}, 0)
	}
	isSelected({ col, row }: Position) {
		const { col: selectedCol, row: selectedRow } = this.#selectionService.value
		return col === selectedCol && row === selectedRow
	}
	toggleNote(value: number) {
		this.#updateSelected(({ box }) => {
			box.notes.toggleNote(value)
			const kind = box.notes.value ? BoxKinds.WhitNotes : BoxKinds.Empty
			return { ...box, value: BoardService.EMPTY_BOX_VALUE, kind }
		})
	}
	erase() {
		this.toggleNumber(BoardService.EMPTY_BOX_VALUE)
	}

	getBox({ col, row }: Position) {
		if (!this.#value.hasBoard) throw new boardErrors.NotInitialized()
		return Object.freeze(this.#value.board[row][col])
	}
	getBoard() {
		const value = this.value
		if (!value.hasBoard) throw new boardErrors.NotInitialized()
		return value.board
	}
	getDifficulty() {
		if (this.#opts == null) throw new boardErrors.OptsNotDefined()
		return this.#opts.difficulty
	}
	getSudokuValue({ col, row }: Position) {
		if (this.#opts == null) throw new boardErrors.OptsNotDefined()
		return this.#opts.solution.value[row][col]
	}

	getEmptyBoxesPos() {
		const emptyBoxesPos: Position[] = []
		boardEach(({ row, col }) => {
			if (!this.#value.hasBoard) throw new boardErrors.NotInitialized()
			const isInitial = this.#value.board[row][col].kind !== BoxKinds.Initial
			if (isInitial) emptyBoxesPos.push({ row, col })
		})

		return Object.freeze(emptyBoxesPos)
	}

	toggleNumber(value: number) {
		this.#updateSelected(({ box, ...pos }) => {
			// reset notes
			box.notes.toggleNote(BoardService.EMPTY_BOX_VALUE)

			// clear box if the insert value is same to box value or empty box value
			if (box.value === value || value === BoardService.EMPTY_BOX_VALUE)
				return { ...box, value: BoardService.EMPTY_BOX_VALUE, kind: BoxKinds.Empty }

			const kind = this.#isCorrect({ value, pos }) ? BoxKinds.Correct : BoxKinds.Incorrect
			return { ...box, value, kind }
		})
	}
}
