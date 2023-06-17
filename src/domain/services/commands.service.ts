import {
	suggestions as initialSuggestions,
	type ICommandsSuggestionsService,
	type IHistoryService,
	type SuggestionOption,
	commandsKeys,
} from '../models'
import type { IHistoryRepo } from '../repositories'

export class CommandsSuggestionService implements ICommandsSuggestionsService {
	#suggestions: SuggestionOption[]
	constructor({ suggestions = initialSuggestions }: { suggestions?: SuggestionOption[] } = {}) {
		this.#suggestions = suggestions
	}
	#getCommandsPattern() {
		return new RegExp(`^(${commandsKeys.join('|')})$`)
	}
	getSuggestions(input: string) {
		const commands = input.trimStart().toLowerCase().split(' ')
		return this.#suggestions.filter(({ match }) => match(commands))
	}
	highlighting(input: string) {
		input = input.replace(
			/(('[^']*'?)|("[^"]*"?))/g,
			'<span class="text-primary-500-400-token">$1</span>'
		)
		input = input.replace(
			/(?<!\w-?)(\d[_\d]*)\b(?![^<>]*<\/span>)/g,
			'<span class="text-secondary-400-500-token">$1</span>'
		)
		input = input.replace(
			/(?<!<span class)(=)(?![^<>]*<\/span>)/g,
			'<span class="text-tertiary-500-400-token">$1</span>'
		)

		const cmdSeparator = input.search(/(?<!<span) /)
		const a = cmdSeparator < 0 ? input.length : cmdSeparator
		let command = input.trim().slice(0, a)

		if (this.#getCommandsPattern().test(command))
			command = '<span class="text-success-500-400-token">' + command + '</span>'
		else command = '<span class="text-error-500-400-token font-semibold">' + command + '</span>'

		return command + input.slice(a)
	}
}

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
		this.#index = this.#AutocompleteHistory.length
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
