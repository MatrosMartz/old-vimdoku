export interface HistoryData {
	getActual: () => string[]
	update: (history: string[]) => void
}

export interface HistoryServiceSchema {
	getCurrent: () => string | null
	getHistory: () => string[]
	initialHistory: () => string[]
	push: (cmd: string) => null
	redo: () => void
	setHistory: (store?: HistoryData) => void
	undo: () => void
}
