export interface ICmdHistoryService {
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
	getHistory: () => readonly string[]
	push: (cmd: string) => void
	redo: () => void
	updateAutocomplete: (input?: string) => void
	undo: () => void
}
