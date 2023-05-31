export const enum BoxStates {
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
	selected: boolean
	state: BoxStates
	value: number
}

export interface Position {
	col: number
	row: number
}

export interface ISudokuService {
	addNote: (value: number) => void
	getBoard: () => readonly BoxSchema[][]
	getBox: (pos: Position) => Readonly<BoxSchema>
	getSelectedPosition: () => Position
	getSudokuValue: (pos: Position) => number
	moveSelected: (pos: Position) => void
	moveDown: (times?: number) => void
	moveLeft: (times?: number) => void
	moveRight: (times?: number) => void
	moveUp: (times?: number) => void
	writeNumber: (value: number) => void
}
