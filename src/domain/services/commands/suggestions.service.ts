import { suggestions, type ICmdSuggestionsService, type SuggestionOption } from '~/domain/models'
import type { Observer } from '~/domain/utils'

export class CmdSuggestionService implements ICmdSuggestionsService {
	#initialSuggestions: SuggestionOption[]
	#value: SuggestionOption[] = []
	#observers: Observer<SuggestionOption[]>[] = []

	constructor({
		initialSuggestions = suggestions,
	}: { initialSuggestions?: SuggestionOption[] } = {}) {
		this.#initialSuggestions = initialSuggestions
		this.update('')
	}

	#notifyObservers() {
		this.#observers.forEach(obs => obs.update(this.#value.map(sub => ({ ...sub }))))
	}
	addObserver(observer: Observer<SuggestionOption[]>) {
		this.#observers = [...this.#observers, observer]
	}
	removeObserver(observer: Observer<SuggestionOption[]>) {
		this.#observers = this.#observers.filter(obs => obs !== observer) ?? []
	}
	getValue = () => Object.freeze(this.#value.map(sub => ({ ...sub })))

	update(input: string) {
		const commands = input.trimStart().toLowerCase().split(' ')
		this.#value = this.#initialSuggestions.filter(({ match }) => match(commands))
		this.#notifyObservers()
	}
}
