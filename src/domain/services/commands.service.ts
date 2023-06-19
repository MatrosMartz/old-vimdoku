import {
	suggestions as initialSuggestions,
	type ICommandsSuggestionsService,
	type IHistoryService,
	type SuggestionOption,
} from '../models'
import type { IHistoryRepo } from '../repositories'
import { commandsPattern } from '../utils'

export class CommandsSuggestionService implements ICommandsSuggestionsService {
	#suggestions: SuggestionOption[]
	constructor({ suggestions = initialSuggestions }: { suggestions?: SuggestionOption[] } = {}) {
		this.#suggestions = suggestions
	}
	getSuggestions(input: string) {
		const commands = input.trimStart().toLowerCase().split(' ')
		return this.#suggestions.filter(({ match }) => match(commands))
	}
	#highlighString(input: string) {
		const replaceValue = '<span class="text-primary-500-400-token">$1</span>'

		return input.replace(/(('[^']*'?)|("[^"]*"?))/g, replaceValue)
	}
	#highlightNumber(input: string) {
		const replaceValue = '<span class="text-secondary-400-500-token">$1</span>'

		input = input.replace(/(?<!\w-?)([1-9][\d_]*)\b(?![^<]*<\/span>)/g, replaceValue)
		return input.replace(
			/(?<!\w-?)(0((x[a-fA-F\d_]*)|(o?[0-8_]*)|(b[01_]*)))\b(?![^<]*<\/span>)/g,
			replaceValue
		)
	}
	#highlightSpecialChars(input: string) {
		const replaceValue = '<span class="text-tertiary-600-300-token">$1</span>'

		input = input.replace(
			/(?<!<span class=[^>]*['"])([=:!?&+\-\^])(?![^<]*<\/span>)/g,
			replaceValue
		)
		return input.replace(/(?<![^\s\t])(no|inv)(?![^<]*<\/span>)/g, replaceValue)
	}
	#highlightCorrectCommand(input: string) {
		return `<span class="text-success-500-400-token">${input}</span>`
	}
	#highlightInCorrectCommand(input: string) {
		return `<span class="text-error-500-400-token font-semibold">${input}</span>`
	}
	highlighting(input: string) {
		input = this.#highlighString(input)
		input = this.#highlightNumber(input)
		input = this.#highlightSpecialChars(input)

		const commandEnd = input.search(/(?<!<span) /)
		let command = input.trim().slice(0, commandEnd < 0 ? input.length : commandEnd)

		command = commandsPattern().test(command)
			? this.#highlightCorrectCommand(command)
			: this.#highlightInCorrectCommand(command)

		return command + input.slice(commandEnd < 0 ? input.length : commandEnd)
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
