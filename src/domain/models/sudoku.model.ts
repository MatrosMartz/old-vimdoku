export const enum BoxStates {
	Correct = 'correct',
	Incorrect = 'incorrect',
	Initial = 'initial',
	Void = 'void',
	WhitNotes = 'notes',
}

export const enum Difficulties {
	Beginner = 1.1,
	Basic = 1.4,
	Easy = 2,
	Medium = 2.4,
	Advanced = 3.1,
	Hard = 4.3,
	Expert = 6,
}

export interface BoxSchema {
	notes: number[]
	selected: boolean
	state: BoxStates
	value: number
}

export interface Position {
	column: number
	row: number
}

export interface SudokuModel {
	addNote: (value: number) => void
	getBoard: () => readonly BoxSchema[][]
	getBox: (pos: Position) => Readonly<BoxSchema>
	getSudokuValue: (pos: Position) => number
	moveSelected: (pos: Position) => void
	writeNumber: (value: number) => void
}
