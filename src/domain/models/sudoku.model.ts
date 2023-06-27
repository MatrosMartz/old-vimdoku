import type { Observable } from '../utils'

export const enum BoxKinds {
	Correct = 'correct',
	Incorrect = 'incorrect',
	Initial = 'initial',
	Empty = 'empty',
	WhitNotes = 'notes',
}

export enum Difficulties {
	Beginner = 1.1,
	Basic = 1.4,
	Easy = 2,
	Medium = 2.4,
	Advanced = 3,
	Hard = 4.1,
	Expert = 4.5,
}

export interface BoxSchema {
	notes: number[]
	kind: BoxKinds
	value: number
}

export interface Position {
	col: number
	row: number
}

export interface IBoardService extends Observable<BoxSchema[][]> {
	addNote: (value: number) => void
	erase: () => void
	getBox: (pos: Position) => Readonly<BoxSchema>
	getEmptyBoxesPos: () => readonly Position[]
	getSudokuValue: (pos: Position) => number
	isSelected: (pos: Position) => boolean
	writeNumber: (value: number) => void
}

export interface ISelectionService extends Observable<Position> {
	moveDown: (times?: number) => void
	moveLeft: (times?: number) => void
	moveRight: (times?: number) => void
	moveTo: (pos: Position) => void
	moveToNextEmpty: (emptiesPos: readonly Position[]) => void
	moveUp: (times?: number) => void
}
