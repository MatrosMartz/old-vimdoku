import {
	BoxKinds,
	type BoxSchema,
	type IBoardService,
	Difficulties,
	type Position,
	type BoardSchema,
	type BoardValue,
	type BoardOpts,
} from '~/domain/models'
import {
	type Observer,
	boardEach,
	BoardErrors,
	type DeepReadonly,
	deepFreeze,
	createBoard,
} from '~/domain/utils'
import { Solution } from '~/domain/entities'

import { SelectionService } from './selection.service'
import type { IBoardRepo } from '~/domain/repositories'

export class BoardService implements IBoardService {
	static EMPTY_BOX_VALUE = 0
	static isWin(board: readonly BoxSchema[][]) {
		return board.every(cols =>
			cols.every(box => [BoxKinds.Initial, BoxKinds.Correct].includes(box.kind))
		)
	}
	static getFirstBoxWithKind(board: DeepReadonly<BoardSchema>, kind: BoxKinds) {
		for (let row = 0; row < 9; row++)
			for (let col = 0; col < 9; col++) if (board[row][col].kind === kind) return { col, row }
	}

	#boardRepo: IBoardRepo
	#selectionService: SelectionService
	#observers: Observer<DeepReadonly<BoardValue>>[] = []

	constructor({
		selectionService = new SelectionService(),
		boardRepo,
	}: {
		boardRepo: IBoardRepo
		selectionService?: SelectionService
	}) {
		this.#boardRepo = boardRepo
		this.#selectionService = selectionService
		this.#notifyObservers()
	}
	#getValue(): BoardValue {
		const board = this.#boardRepo.getBoard()
		if (board == null) return { hasBoard: false }
		return { hasBoard: true, board }
	}
	#notifyObservers() {
		const immutableBoard = deepFreeze(this.#getValue())
		this.#observers.forEach(obs => obs.update(immutableBoard))
	}
	addObserver(observer: Observer<DeepReadonly<BoardValue>>) {
		this.#observers = [...this.#observers, observer]
	}
	removeObserver(observer: Observer<DeepReadonly<BoardValue>>) {
		this.#observers = this.#observers.filter(obs => obs !== observer)
	}
	get value() {
		return this.#getValue()
	}

	#updateSelected(update: (args: { box: BoxSchema } & Position) => BoxSchema) {
		this.#boardRepo.update(value => {
			boardEach(({ row, col }) => {
				const box = this.getBox({ row, col })
				if (this.isSelected({ row, col }) && box.kind !== BoxKinds.Initial)
					value.board[row][col] = update({ box, row, col })
			})
			return { ...value }
		})

		this.#notifyObservers()
	}
	#isCorrect({ value, pos }: { value: number; pos: Position }) {
		return this.getSudokuValue(pos) === value
	}

	initBoard(initialOpts: Partial<BoardOpts> = {}) {
		this.#boardRepo.delete()
		this.#notifyObservers()
		setTimeout(() => {
			const opts: BoardOpts = {
				difficulty: initialOpts.difficulty ?? Difficulties.Easy,
				solution: initialOpts.solution ?? new Solution(),
			}
			this.#boardRepo.setBoard(createBoard(opts))
			this.#boardRepo.setOpts(opts)
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
		const value = this.#getValue()
		if (!value.hasBoard) throw new BoardErrors.NotInitialized()
		return Object.freeze(value.board[row][col])
	}
	getBoard() {
		const value = this.value
		if (!value.hasBoard) throw new BoardErrors.NotInitialized()
		return value.board
	}
	getDifficulty() {
		const opts = this.#boardRepo.getOpts()
		if (opts == null) throw new BoardErrors.OptsNotDefined()
		return opts.difficulty
	}
	getSudokuValue({ col, row }: Position) {
		const opts = this.#boardRepo.getOpts()
		if (opts == null) throw new BoardErrors.OptsNotDefined()
		return opts.solution.value[row][col]
	}

	getEmptyBoxesPos() {
		const emptyBoxesPos: Position[] = []
		const value = this.#getValue()
		if (!value.hasBoard) throw new BoardErrors.NotInitialized()
		boardEach(({ row, col }) => {
			const isInitial = value.board[row][col].kind !== BoxKinds.Initial
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
