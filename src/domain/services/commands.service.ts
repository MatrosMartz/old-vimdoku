import {
	suggestions as initialSuggestions,
	type ICmdSuggestionsService,
	type ICmdHistoryService,
	type SuggestionOption,
	type ICmdHighlightService,
} from '../models'
import type { IHistoryRepo } from '../repositories'
import { commandsPattern } from '../utils'

export class CmdHighlightService implements ICmdHighlightService {
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
		input = input.replace(
			new RegExp(
				`(?<=h(?:elp)? )(?<!<span class=[^>]*['"])(:(${commandsPattern}))$(?![^<]*<\/span>)`
			),
			'<span class="text-secondary-600-300-token">$1</span>'
		)

		const replaceValue = '<span class="text-tertiary-600-300-token">$1</span>'

		input = input.replace(
			/(?<!(?:<span class=[^>]*['"])|(?:^\w*))([=:!?&+\-\^])(?![^<]*<\/span>)/g,
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
	#getCommand(input: string) {
		let commandEnd = input.search(/(?<!<span) /)
		commandEnd = commandEnd < 0 ? input.length : commandEnd
		const command = input.trim().slice(0, commandEnd)

		return { command, commandEnd }
	}
	highlighting(input: string) {
		input = this.#highlighString(input)
		input = this.#highlightNumber(input)
		input = this.#highlightSpecialChars(input)

		const { command, commandEnd } = this.#getCommand(input)

		const newCommand = new RegExp(`(${commandsPattern})$`).test(command)
			? this.#highlightCorrectCommand(command)
			: this.#highlightInCorrectCommand(command)

		return newCommand + input.slice(commandEnd)
	}
}

export class CmdSuggestionService implements ICmdSuggestionsService {
	#suggestions: SuggestionOption[]
	#matchSuggestions: SuggestionOption[] = []

	constructor({ suggestions = initialSuggestions }: { suggestions?: SuggestionOption[] } = {}) {
		this.#suggestions = suggestions
		this.updateSuggestions('')
	}
	updateSuggestions(input: string) {
		const commands = input.trimStart().toLowerCase().split(' ')
		this.#matchSuggestions = this.#suggestions.filter(({ match }) => match(commands))
	}
	getSuggestions() {
		return this.#matchSuggestions
	}
}

export class CmdHistoryService implements ICmdHistoryService {
	#autocompleteHistory: string[]
	#autocompleteTimeout?: ReturnType<typeof setTimeout>
	#index: number | null = null
	#repo: IHistoryRepo
	#currentInput = ''

	constructor(repo: IHistoryRepo) {
		this.#repo = repo
		this.#autocompleteHistory = [...this.#repo.get()]
	}

	#getAutocomplete(input?: string) {
		const history = this.#repo.get()
		return input ? history.filter(cmd => cmd.startsWith(input)) : history
	}

	getCurrent() {
		if (this.#index == null) return this.#currentInput
		return this.#autocompleteHistory[this.#index] ?? this.#currentInput
	}
	getHistory = () => this.#repo.get()
	getAutocompleteHistory = () => this.#autocompleteHistory
	push(cmd: string) {
		this.#repo.update(history => [...history, cmd])
		this.updateAutocomplete()
		this.#index = this.#autocompleteHistory.length
		this.#currentInput = ''
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
		this.#currentInput = input ?? ''

		this.#autocompleteTimeout = setTimeout(() => {
			this.#autocompleteHistory = [...this.#getAutocomplete(input)]
			this.#index = this.#autocompleteHistory.length
		}, 500)
	}
}
