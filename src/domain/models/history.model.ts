export interface IHistoryService {
	getAutocompleteHistory: () => string[]
	getCurrent: () => string | null
	getHistory: () => string[]
	push: (cmd: string) => null
	redo: () => void
	setAutocomplete: (input?: string) => void
	undo: () => void
}
