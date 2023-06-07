export interface IHistoryService {
	/**
	 * get Autocomplete History
	 */
	getAutocompleteHistory: () => string[]
	/**
	 * get current value
	 */
	getCurrent: () => string | null
	/**
	 * get All History
	 */
	getHistory: () => string[]
	push: (cmd: string) => null
	redo: () => void
	setAutocomplete: (input?: string) => void
	undo: () => void
}
