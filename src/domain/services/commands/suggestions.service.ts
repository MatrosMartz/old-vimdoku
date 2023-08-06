import { type ICmdSuggestionsService, type SuggestionOption, suggestions } from '~/domain/models'
import type { Observer } from '~/domain/utils'

export class CmdSuggestionService implements ICmdSuggestionsService {
	#initialSuggestions: SuggestionOption[]
	#observers: Array<Observer<SuggestionOption[]>> = []
	#value: SuggestionOption[] = []

	constructor({
		initialSuggestions = suggestions,
	}: { initialSuggestions?: SuggestionOption[] } = {}) {
		this.#initialSuggestions = initialSuggestions
		this.update('')
	}

	get value() {
		return Object.freeze(this.#value.map(sub => ({ ...sub })))
	}

	addObserver(observer: Observer<SuggestionOption[]>) {
		this.#observers = [...this.#observers, observer]
	}

	removeObserver(observer: Observer<SuggestionOption[]>) {
		this.#observers = this.#observers.filter(obs => obs !== observer) ?? []
	}

	update(input: string) {
		const commands = input.trimStart().toLowerCase().split(' ')
		this.#value = this.#initialSuggestions.filter(({ match }) => match(commands))
		this.#notifyObservers()
	}

	#notifyObservers() {
		this.#observers.forEach(obs => {
			obs.update(this.#value.map(sub => ({ ...sub })))
		})
	}
}
