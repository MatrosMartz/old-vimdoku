export interface HistoryData {
	getActual: () => string[]
	update: (history: string[]) => void
}

export interface HistoryServiceSchema {
	getAutocompleteHistory: () => string[]
	getCurrent: () => string | null
	getHistory: () => string[]
	push: (cmd: string) => null
	redo: () => void
	setHistory: (store?: HistoryData) => void
	setAutocomplete: (input?: string) => void
	undo: () => void
}
