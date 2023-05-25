import type { DataStorage, HistoryModel } from '../models'

export class HistoryService implements HistoryModel {
	#history: string[] = []
	#AutocompleteHistory = this.#history
	#index: number | null = null
	#updateData: ((history: string[]) => void) | null = null

	constructor(from?: DataStorage) {
		if (from) {
			this.#history = from.getActual()
			this.#updateData = from.update
		}
		this.setAutocomplete()
		this.#updateData = null
	}

	getCurrent = () => {
		return this.#AutocompleteHistory[this.#index ?? Infinity] ?? ''
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
		if (this.#index != null && this.#index < this.#AutocompleteHistory.length - 1) this.#index += 1
	}
	undo = () => {
		if (this.#index !== null && this.#index > 0) this.#index -= 1
		else this.#index = 0
	}

	setAutocomplete = (input?: string) => {
		this.#AutocompleteHistory = input
			? this.#history.filter(cmd => cmd.startsWith(input))
			: this.#history
		this.#index = this.#AutocompleteHistory.length
	}
}
