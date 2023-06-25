import type { ICmdHistoryService } from '~/domain/models'
import type { IHistoryRepo } from '~/domain/repositories'

export class CmdHistoryService implements ICmdHistoryService {
	#autocompleteHistory: string[]
	#autocompleteTimeout?: ReturnType<typeof setTimeout>
	#index: number
	#repo: IHistoryRepo
	#currentInput = ''

	constructor(repo: IHistoryRepo) {
		this.#repo = repo
		this.#autocompleteHistory = [...this.#repo.get()]
		this.#index = this.#autocompleteHistory.length
	}

	#getAutocomplete(input?: string) {
		const history = this.#repo.get()
		return input ? history.filter(cmd => cmd.startsWith(input)) : history
	}
	#updateAutocomplete(input?: string) {
		this.#currentInput = input ?? ''
		this.#autocompleteHistory = [...this.#getAutocomplete(input)]
		this.#index = this.#autocompleteHistory.length
	}

	getCurrent() {
		if (this.#index == null) return this.#currentInput
		return this.#autocompleteHistory[this.#index] ?? this.#currentInput
	}
	getHistory = () => this.#repo.get()
	getAutocompleteHistory = () => this.#autocompleteHistory
	push(cmd: string) {
		this.#repo.update(history => [...history, cmd])
		this.#index = this.#autocompleteHistory.length
		this.#updateAutocomplete()
	}

	redo() {
		if (this.#index != null && this.#index < this.#autocompleteHistory.length) this.#index += 1
	}
	undo() {
		if (this.#index !== null && this.#index > 0) this.#index -= 1
		else this.#index = 0
	}

	updateAutocomplete(input?: string) {
		if (this.#autocompleteTimeout != null) clearTimeout(this.#autocompleteTimeout)
		this.#autocompleteTimeout = setTimeout(() => this.#updateAutocomplete(input), 500)
	}
}
