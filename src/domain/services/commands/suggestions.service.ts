import {
	suggestions as initialSuggestions,
	type ICmdSuggestionsService,
	type SuggestionOption,
} from '~/domain/models'

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
