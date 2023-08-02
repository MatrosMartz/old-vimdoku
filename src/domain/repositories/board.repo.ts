import type { BoardOpts, BoardSchema } from '../models'
import type { UpdateRepo } from '../utils'

export interface IBoardRepo {
	getBoard: () => BoardSchema | null
	setBoard: (newBoard: BoardSchema) => void
	getOpts: () => Readonly<BoardOpts> | null
	setOpts: (newOpts: BoardOpts) => void
	update: UpdateRepo<{ board: BoardSchema; opts: BoardOpts }>
}
