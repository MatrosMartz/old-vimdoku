import type { ICmdAutocompleteService, ICmdHistoryService } from '~/domain/models'
import type { IHistoryRepo } from '~/domain/repositories'

export class CmdHistoryService implements ICmdHistoryService {
	#repo: IHistoryRepo

	constructor(repo: IHistoryRepo) {
		this.#repo = repo
	}
	get value() {
		return this.#repo.get()
	}
	add(cmd: string) {
		this.#repo.update(history => [...history, cmd])
	}
	clear() {
		this.#repo.update(() => [])
	}
}

export class CmdAutocompleteService implements ICmdAutocompleteService {
	#cmdHistory: CmdHistoryService
	#autocomplete: string[]
	#timeoutID?: ReturnType<typeof setTimeout>
	#index: number
	#currentInput = ''
	#value = this.#currentInput

	constructor({ cmdHistory }: { cmdHistory: CmdHistoryService }) {
		this.#cmdHistory = cmdHistory
		this.#autocomplete = [...cmdHistory.value]
		this.#index = this.#autocomplete.length
	}
	get value() {
		return this.#value
	}

	#updateValue() {
		this.#value =
			this.#index == null
				? this.#currentInput
				: this.#autocomplete[this.#index] ?? this.#currentInput
	}
	getCmdAutocomplete = () => Object.freeze(this.#autocomplete)
	#updateAutocomplete(input: string = '') {
		this.#currentInput = input
		this.#autocomplete = this.#cmdHistory.value.filter(cmd => cmd.startsWith(input))
		this.#index = this.#autocomplete.length
		this.#updateValue()
	}
	push(cmd: string) {
		this.#cmdHistory.add(cmd)
		this.#updateAutocomplete()
	}
	redo() {
		if (this.#index < this.#autocomplete.length) this.#index += 1
		this.#updateValue()
	}
	undo() {
		if (this.#index > 0) this.#index -= 1
		else this.#index = 0
		this.#updateValue()
	}

	search(input?: string) {
		if (this.#timeoutID != null) clearTimeout(this.#timeoutID)
		this.#timeoutID = setTimeout(() => this.#updateAutocomplete(input), 500)
	}
}
