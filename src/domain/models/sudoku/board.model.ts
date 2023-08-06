import type { Notes, Solution } from '~/domain/entities'
import type { DeepReadonly, Observable } from '~/domain/utils'

import type { Position } from './selection.model'

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
	kind: BoxKinds
	notes: Notes
	value: number
}

export type BoardSchema = BoxSchema[][]

export type BoardValue = { board: BoardSchema; hasBoard: true } | { hasBoard: false }

export interface BoardOpts {
	difficulty: Difficulties
	solution: Solution
}
export interface IBoardService extends Observable<DeepReadonly<BoardValue>> {
	erase(): void
	getBoard(): DeepReadonly<BoardSchema>
	getBox(pos: Position): Readonly<BoxSchema>
	getDifficulty(): Difficulties
	getEmptyBoxesPos(): readonly Position[]
	getSudokuValue(pos: Position): number
	initBoard(args: { difficulty?: Difficulties; solution?: Solution }): void
	isSelected(pos: Position): boolean
	toggleNote(value: number): void
	toggleNumber(value: number): void
}
