import type { IHistoryService } from '../models'
import type { IHistoryRepo } from '../repositories'

export class HistoryService implements IHistoryService {
	#AutocompleteHistory: string[]
	#autocompleteTimeout?: ReturnType<typeof setTimeout>
	#index: number | null = null
	#repo: IHistoryRepo

	constructor(repo: IHistoryRepo) {
		this.#repo = repo
		this.#AutocompleteHistory = this.#repo.get()
	}

	#getAutocomplete(input?: string) {
		const history = this.#repo.get()
		return input ? history.filter(cmd => cmd.startsWith(input)) : history
	}

	getCurrent() {
		if (this.#index == null) return ''
		return this.#AutocompleteHistory[this.#index] ?? ''
	}
	getHistory = () => this.#repo.get()
	getAutocompleteHistory = () => this.#AutocompleteHistory
	push(cmd: string) {
		this.#repo.update(history => [...history, cmd])
		this.updateAutocomplete()
	}

	redo() {
		if (this.#index != null && this.#index < this.#AutocompleteHistory.length - 1) this.#index += 1
	}
	undo() {
		if (this.#index !== null && this.#index > 0) this.#index -= 1
		else this.#index = 0
	}

	updateAutocomplete(input?: string) {
		if (this.#autocompleteTimeout != null) clearTimeout(this.#autocompleteTimeout)

		this.#autocompleteTimeout = setTimeout(() => {
			this.#AutocompleteHistory = this.#getAutocomplete(input)
			this.#index = this.#AutocompleteHistory.length
		}, 100)
	}
}
