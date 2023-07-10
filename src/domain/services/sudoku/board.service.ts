import {
	BoxKinds,
	type BoxSchema,
	type IBoardService,
	Difficulties,
	type Position,
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
	static getFirstBoxWithKind(board: readonly BoxSchema[][], kind: BoxKinds) {
		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[row].length; col++) {
				if (board[row][col].kind === kind) return { col, row }
			}
		}
	}

	#opts: { difficulty: Difficulties; solution: Solution } | null
	#selectionService: SelectionService
	#value: BoxSchema[][]
	#observers: Observer<BoxSchema[][]>[] = []

	constructor({
		selectionService = new SelectionService(),
	}: {
		selectionService?: SelectionService
	} = {}) {
		this.#opts = null
		this.#value = this.#createBoard()
		this.#selectionService = selectionService
	}
	#notifyObservers() {
		this.#observers.forEach(obs => {
			obs.update(this.#value.map(boxes => boxes.map(box => ({ ...box }))))
		})
	}
	addObserver(observer: Observer<BoxSchema[][]>) {
		this.#observers = [...this.#observers, observer]
	}
	removeObserver(observer: Observer<BoxSchema[][]>) {
		this.#observers = this.#observers.filter(obs => obs !== observer)
	}
	getValue = () => Object.freeze(this.#value)

	#createBoard() {
		const boardValue: BoxSchema[][] = []
		for (let row = 0; row < 9; row++) {
			boardValue[row] = []
			for (let col = 0; col < 9; col++) {
				if (this.#opts == null) boardValue[row][col] = { notes: [], kind: BoxKinds.Empty, value: 0 }
				else {
					const { difficulty, solution } = this.#opts
					const isInitial = probabilityToBeInitial(difficulty)
					const kind = isInitial ? BoxKinds.Initial : BoxKinds.Empty
					const value = isInitial ? solution.value[row][col] : BoardService.EMPTY_BOX_VALUE

					boardValue[row][col] = { notes: [], kind, value }
				}
			}
		}
		return boardValue
	}
	#updateSelected(update: (args: { box: BoxSchema } & Position) => BoxSchema) {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				const box = this.getBox({ col, row })
				if (this.isSelected({ row, col }) && box.kind !== BoxKinds.Initial)
					this.#value[row][col] = update({ box, col, row })
			}
		}
		this.#notifyObservers()
	}

	initBoard({
		difficulty = Difficulties.Easy,
		solution = new Solution(),
	}: { difficulty?: Difficulties; solution?: Solution } = {}) {
		this.#opts = { difficulty, solution }

		this.#value = this.#createBoard()
		this.#notifyObservers()
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

	getBox = ({ col, row }: Position) => Object.freeze(this.#value[row][col])
	getDifficulty() {
		if (this.#opts == null) throw new Error('opts not defined')
		return this.#opts.difficulty
	}
	getSudokuValue({ col, row }: Position) {
		if (this.#opts == null) throw new Error('opts not defined')
		return this.#opts.solution.value[row][col]
	}

	getEmptyBoxesPos() {
		const emptyBoxesPos: Position[] = []
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (this.#value[row][col].kind !== BoxKinds.Initial) emptyBoxesPos.push({ row, col })
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
