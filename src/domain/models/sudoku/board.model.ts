import type { Observable } from '~/domain/utils'
import type { Position } from './selection.model'
import type { Solution } from '~/domain/entities'

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

export type BoardSchema = readonly (readonly BoxSchema[])[]

export type BoardValue = { hasBoard: true; board: BoardSchema } | { hasBoard: false }

export interface IBoardService extends Observable<BoardValue> {
	addNote: (value: number) => void
	erase: () => void
	getBox: (pos: Position) => Readonly<BoxSchema>
	getBoard: () => BoardSchema
	getDifficulty: () => Difficulties
	getEmptyBoxesPos: () => readonly Position[]
	getSudokuValue: (pos: Position) => number
	initBoard: (args: { difficulty?: Difficulties; solution?: Solution }) => void
	hasBoard: () => boolean
	isSelected: (pos: Position) => boolean
	writeNumber: (value: number) => void
}
