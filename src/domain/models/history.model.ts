export interface HistoryData {
	getActual: () => string[]
	update: (history: string[]) => void
}

export interface HistoryModel {
	getAutocompleteHistory: () => string[]
	getCurrent: () => string | null
	getHistory: () => string[]
	push: (cmd: string) => null
	redo: () => void
	setAutocomplete: (input?: string) => void
	undo: () => void
}
