export const enum BoxKinds {
	Correct = 'correct',
	Incorrect = 'incorrect',
	Initial = 'initial',
	Empty = 'empty',
	WhitNotes = 'notes',
}

export const enum Difficulties {
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

export interface IBoardService {
	addNote: (value: number) => void
	getBoard: () => readonly BoxSchema[][]
	getBox: (pos: Position) => Readonly<BoxSchema>
	getSudokuValue: (pos: Position) => number
	writeNumber: (value: number) => void
	isSelected: (pos: Position) => boolean
}

export interface ISelectionService {
	moveDown: (times?: number) => void
	moveLeft: (times?: number) => void
	moveRight: (times?: number) => void
	moveTo: (pos: Position) => void
	moveUp: (times?: number) => void
	getSelectionPosition: () => Position
}
