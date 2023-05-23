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

export interface SudokuModel {
	getBoard: () => BoxSchema[][]
	moveSelected: (pos: { column: number; row: number }) => void
	writeNumber: (pos: { column: number; row: number }, value: number) => void
}
