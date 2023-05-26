import type { HistoryModel } from '../models'
import type { DataStorageRepo } from '../repositories'

export class HistoryService implements HistoryModel {
	#history: string[] = []
	#AutocompleteHistory = this.#history
	#index: number | null = null
	#updateData = () => {}

	constructor(from?: DataStorageRepo<string[]>) {
		if (from) {
			const newHistory = from.get()
			if (newHistory != null) this.#history = newHistory

			this.#updateData = () => from.set(this.#history)
		}
		this.setAutocomplete()
	}

	getCurrent = () => {
		return this.#AutocompleteHistory[this.#index ?? Infinity] ?? ''
	}
	getHistory = () => this.#history
	getAutocompleteHistory = () => this.#AutocompleteHistory
	push = (cmd: string) => {
		this.#history.push(cmd)
		this.setAutocomplete()

		this.#updateData()

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
