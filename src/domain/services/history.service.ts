import type { HistoryData, HistoryServiceSchema } from '../models'

class HistoryService implements HistoryServiceSchema {
	#history: string[] = []
	#AutocompleteHistory = this.#history
	#index: number = null
	#updateData: (history: string[]) => void = null

	getCurrent = () => {
		return this.#AutocompleteHistory[this.#index] ?? ''
	}
	getHistory = () => this.#history
	getAutocompleteHistory = () => this.#AutocompleteHistory
	push = (cmd: string) => {
		this.#history = [...this.#history, cmd]
		this.setAutocomplete()

		this.#updateData?.(this.#history)

		return null
	}

	redo = () => {
		if (this.#index < this.#AutocompleteHistory.length - 1) this.#index += 1
	}
	undo = () => {
		if (this.#index > 0) this.#index -= 1
		else this.#index = 0
	}

	setHistory = (from?: HistoryData) => {
		if (from) {
			this.#history = from.getActual()
			this.#updateData = from.update
		}
		this.setAutocomplete()
		this.#updateData = null
	}
	setAutocomplete = (input?: string) => {
		this.#AutocompleteHistory = input
			? this.#history.filter(cmd => cmd.startsWith(input))
			: this.#history
		this.#index = this.#AutocompleteHistory.length
	}
}

export const historyService = new HistoryService()
