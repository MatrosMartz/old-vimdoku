import type { SolutionValue } from '~/domain/entities'
import type { BoardOpts, BoardSchema, BoxKinds, Difficulties } from '~/domain/models'
import type { UpdaterRepo } from '~/domain/utils'

export type GameBoxData =
	| {
			kind: Exclude<BoxKinds, BoxKinds.WhitNotes | BoxKinds.Empty>
			notes: undefined
			value: number
	  }
	| { kind: BoxKinds.Empty; notes: undefined; value: undefined }
	| { kind: BoxKinds.WhitNotes; notes: number[]; value: undefined }

export interface OptsStorage {
	difficulty: Difficulties
	solution: SolutionValue
}

export interface IBoardRepo {
	delete(): void
	getBoard(): BoardSchema | null
	getOpts(): Readonly<BoardOpts> | null
	setBoard(newBoard: BoardSchema): void
	setOpts(newOpts: BoardOpts): void
	update(updater: UpdaterRepo<{ board: BoardSchema; opts: BoardOpts }>): void
}
