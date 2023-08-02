import { Notes } from '~/domain/entities'
import { BoxKinds, type BoardOpts, type BoardSchema, type BoxSchema } from '~/domain/models'
import type { DataRepo, IBoardRepo } from '~/domain/repositories'
import { type DeepReadonly, type UpdaterRepo, createMatrix, deepFreeze } from '~/domain/utils'

export type GameBoxData =
	| {
			kind: Exclude<BoxKinds, BoxKinds.WhitNotes | BoxKinds.Empty>
			notes: undefined
			value: number
	  }
	| { kind: BoxKinds.Empty; notes: undefined; value: undefined }
	| { kind: BoxKinds.WhitNotes; notes: number[]; value: undefined }

export class BoardRepo implements IBoardRepo {
	#gameStorage: DataRepo<DeepReadonly<GameBoxData[][]>>
	#gameValue?: DeepReadonly<GameBoxData[][]>
	#optsStorage: DataRepo<BoardOpts>
	#optsValue?: BoardOpts

	constructor({
		gameStorage,
		optsStorage,
	}: {
		gameStorage: DataRepo<DeepReadonly<GameBoxData[][]>>
		optsStorage: DataRepo<BoardOpts>
	}) {
		this.#gameStorage = gameStorage
		this.#optsStorage = optsStorage
	}

	getOpts = () => this.#optsValue ?? this.#optsStorage.get()

	setOpts(newOpts: BoardOpts) {
		this.#optsValue = { ...newOpts }
		this.#optsStorage.set(this.#optsValue)
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
}
