export interface ICmdHistoryService {
	getValue: () => readonly string[]
	add: (cmd: string) => void
	clear: () => void
}

export interface ICmdAutocompleteService {
	getCmdAutocomplete: () => readonly string[]
	getValue: () => string
	push: (cmd: string) => void
	redo: () => void
	search: (input?: string) => void
	undo: () => void
}
