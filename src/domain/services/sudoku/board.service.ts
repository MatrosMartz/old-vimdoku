import {
	BoxKinds,
	type BoxSchema,
	type IBoardService,
	Difficulties,
	type Position,
	type BoardSchema,
	type BoardValue,
} from '~/domain/models'
import { addNewNote, probabilityToBeInitial, type Observer } from '~/domain/utils'
import { Solution } from '~/domain/entities'

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
	#value: BoardValue
	#observers: Observer<BoardSchema>[] = []

	constructor({
		selectionService = new SelectionService(),
	}: {
		selectionService?: SelectionService
	} = {}) {
		this.#opts = null
		this.#value = { isActive: false }
		this.#selectionService = selectionService
	}
	hasBoard = () => this.#value.isActive
	#boardFreeze(board: BoxSchema[][]) {
		const freezeBox = (box: BoxSchema) => Object.freeze({ ...box, notes: [...box.notes] })
		const freezeCol = (col: BoxSchema[]) => Object.freeze(col.map(freezeBox))
		return Object.freeze(board.map(freezeCol))
	}
	#notifyObservers() {
		if (this.#value.isActive) {
			const immutableBoard = this.#boardFreeze(this.#value.board)
			this.#observers.forEach(obs => obs.update(immutableBoard))
		}
	}
	addObserver(observer: Observer<BoardSchema>) {
		this.#observers = [...this.#observers, observer]
		if (this.#value.isActive) {
			const immutableBoard = this.#boardFreeze(this.#value.board)
			observer.update(immutableBoard)
		}
	}
	removeObserver(observer: Observer<BoardSchema>) {
		this.#observers = this.#observers.filter(obs => obs !== observer)
	}
	getValue() {
		console.log(this.#value)
		if (!this.#value.isActive) throw new Error('board not initialized')
		return this.#boardFreeze(this.#value.board)
	}

	#createBoard({ difficulty, solution }: { difficulty: Difficulties; solution: Solution }) {
		const boardValue: BoxSchema[][] = []
		for (let row = 0; row < 9; row++) {
			boardValue[row] = []
			for (let col = 0; col < 9; col++) {
				const isInitial = probabilityToBeInitial(difficulty)
				const kind = isInitial ? BoxKinds.Initial : BoxKinds.Empty
				const value = isInitial ? solution.value[row][col] : BoardService.EMPTY_BOX_VALUE

				boardValue[row][col] = { notes: [], kind, value }
			}
		}
		return boardValue
	}
	#updateSelected(update: (args: { box: BoxSchema } & Position) => BoxSchema) {
		if (!this.#value.isActive) throw new Error('board not initialized')
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				const box = this.getBox({ col, row })
				if (this.isSelected({ row, col }) && box.kind !== BoxKinds.Initial)
					this.#value.board[row][col] = update({ box, col, row })
			}
		}
		this.#notifyObservers()
	}

	initBoard({
		difficulty = Difficulties.Easy,
		solution = new Solution(),
	}: { difficulty?: Difficulties; solution?: Solution } = {}) {
		setTimeout(() => {
			this.#opts = { difficulty, solution }
			this.#value = { isActive: true, board: this.#createBoard(this.#opts) }
			this.#notifyObservers()
		}, 0)
	}
	isSelected({ col, row }: Position) {
		const { col: selectedCol, row: selectedRow } = this.#selectionService.getValue()
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
	erase() {
		this.writeNumber(BoardService.EMPTY_BOX_VALUE)
	}

	getBox({ col, row }: Position) {
		if (!this.#value.isActive) throw new Error('board not initialized')
		return Object.freeze(this.#value.board[row][col])
	}
	getDifficulty() {
		if (this.#opts == null) throw new Error('opts not defined')
		return this.#opts.difficulty
	}
	getSudokuValue({ col, row }: Position) {
		if (this.#opts == null) throw new Error('opts not defined')
		return this.#opts.solution.value[row][col]
	}

	getEmptyBoxesPos() {
		if (!this.#value.isActive) throw new Error('board not initialized')
		const emptyBoxesPos: Position[] = []
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (this.#value.board[row][col].kind !== BoxKinds.Initial) emptyBoxesPos.push({ row, col })
			}
		}

		return Object.freeze(emptyBoxesPos)
	}

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