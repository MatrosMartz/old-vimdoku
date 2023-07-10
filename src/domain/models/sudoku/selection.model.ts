import type { Observable } from '~/domain/utils'

export interface Position {
	col: number
	row: number
}

export interface ISelectionService extends Observable<Position> {
	moveDown: (times?: number) => void
	moveLeft: (times?: number) => void
	moveRight: (times?: number) => void
	moveTo: (pos: Position) => void
	moveToNextEmpty: (emptiesPos: readonly Position[]) => void
	moveUp: (times?: number) => void
}
