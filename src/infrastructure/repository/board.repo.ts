import { Notes, Solution } from '~/domain/entities'
import { BoxKinds, type BoardOpts, type BoardSchema, type BoxSchema } from '~/domain/models'
import type { DataRepo, GameBoxData, IBoardRepo, OptsStorage } from '~/domain/repositories'
import { type DeepReadonly, type UpdaterRepo, createMatrix } from '~/domain/utils'

type ReadonlyGameBoxData = DeepReadonly<GameBoxData[][]>

export class BoardRepo implements IBoardRepo {
	#gameStorage: DataRepo<ReadonlyGameBoxData>
	#gameValue?: ReadonlyGameBoxData
	#optsStorage: DataRepo<OptsStorage>
	#optsValue?: BoardOpts

	constructor({
		gameStorage,
		optsStorage,
	}: {
		gameStorage: DataRepo<ReadonlyGameBoxData>
		optsStorage: DataRepo<OptsStorage>
	}) {
		this.#gameStorage = gameStorage
		this.#optsStorage = optsStorage
	}

	#parseOpts(): BoardOpts | null {
		const opts = this.#optsStorage.get()
		if (opts == null) return null

		const solution = new Solution({ initialSolution: opts.solution })
		return { difficulty: opts.difficulty, solution }
	}

	getOpts() {
		return this.#optsValue ?? this.#parseOpts()
	}

	setOpts({ difficulty, solution }: BoardOpts) {
		this.#optsStorage.set({ difficulty, solution: solution.value })
	}
	setBoard(newBoard: BoardSchema) {
		this.#gameValue = createMatrix<GameBoxData>(9, {
			fn({ row, col }) {
				const { kind, notes: noteEntity, value } = newBoard[row][col]
				if (kind === BoxKinds.WhitNotes)
					return { kind, notes: noteEntity.value.filter(n => n != null) as number[] }
				if (kind === BoxKinds.Empty) return { kind }
				return { kind, value }
			},
		})
		this.#gameStorage.set(this.#gameValue)
	}

	getBoard() {
		const game = this.#gameValue ?? this.#gameStorage.get()
		if (game == null) return game

		const board: BoardSchema = createMatrix<BoxSchema>(9, {
			fn({ row, col }) {
				const { kind, notes, value } = game[row][col]
				return { kind, notes: new Notes(notes), value: value ?? 0 }
			},
		})

		return board
	}

	update(updater: UpdaterRepo<{ board: BoardSchema; opts: BoardOpts }>) {
		const opts = this.getOpts()
		const board = this.getBoard()
		if (opts == null || board == null) return

		const { opts: newOpts, board: newBoard } = updater({ opts, board })

		this.setOpts(newOpts)
		this.setBoard(newBoard)
	}

	delete() {
		this.#gameStorage.delete()
		this.#optsStorage.delete()
	}
}
