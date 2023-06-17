import { getKeysByType } from '../utils'
import { Modes } from './modes.model'
import { defaultPreferences } from './preferences.model'
import { Difficulties } from './sudoku.model'

export interface SuggestionOption {
	command: string
	description: string
	id: string
	match: (input: string[]) => boolean
	newSelection?: [number, number]
	value: string
}

export interface ICommandsSuggestionsService {
	getSuggestions: (string: string) => SuggestionOption[]
	highlighting: (input: string) => string
}

const special = (str: string) => `<span class="text-surface-500-400-token">{${str}}</span>`
const optional = (str: string) => `<span class="text-tertiary-700-200-token">[${str}]</span>`
const pref = (str: string) => `<span class="text-secondary-600-300-token">${str}</span>`
const text = (str: string) => `<span class="text-primary-500-400-token">${str}</span>`

const preferencesKeys = Object.keys(defaultPreferences).map(key => key.toLowerCase())
const { numberKeys, stringKeys, toggleKeys } = getKeysByType(defaultPreferences)
const modesKeys = Object.keys(Modes).map(mode => mode.toLowerCase())
const difficultiesKeys = Object.keys(Difficulties)
	.filter(difficulty => Number.isNaN(Number(difficulty)))
	.map(difficulty => difficulty.toLowerCase())
export const commandsKeys = ['help', 'set', 'start', 'pause', 'reset', 'continue', 'quit']

const someStartsWith = (commands: string[], input: string) =>
	commands.some(cmd => cmd.includes(input))

export const gameSuggestions: SuggestionOption[] = [
	{
		command: `:start ${special('difficulty')}`,
		description: 'start sudoku game in difficulty selected',
		id: 'start-select',
		match: input => {
			const [command] = input

			return 'start'.startsWith(command)
		},
		value: 'start ',
	},
	...(function () {
		return difficultiesKeys.map<SuggestionOption>(difficulty => ({
			command: `:start ${difficulty}`,
			description: `start sudoku game in ${difficulty}`,
			id: `start-difficulty.${difficulty}`,
			match: input => {
				const [command, subcommand] = input

				return 'start'.startsWith(command) && difficulty.startsWith(subcommand)
			},
			value: `start ${difficulty}`,
		}))
	})(),
	{
		command: ':pause',
		description: 'pause game',
		id: 'pause',
		match: input => 'pause'.startsWith(input[0]),
		value: 'pause',
	},
	{
		command: ':continue',
		description: 'continue game',
		id: 'continue',
		match: input => 'continue'.startsWith(input[0]),
		value: 'continue',
	},
]

export const helpSuggestions: SuggestionOption[] = [
	{
		command: `:h${optional('elp')}`,
		description: 'Open a window and display the help file in read-only mode.',
		id: 'help-main',
		match: input => someStartsWith(['h', 'help'], input[0]),
		value: 'help',
	},
	{
		command: `:h${optional('elp')} ${special('subject')}`,
		description: 'Like ":help", additionally jump to the tag {subject}.',
		id: 'help-select',
		match: input => someStartsWith(['h', 'help'], input[0]),
		value: 'help ',
	},
	...(function () {
		return commandsKeys.map<SuggestionOption>(cmd => ({
			command: `:h${optional('elp')} <span class="text-secondary-600-300-token">:${cmd}</span>`,
			description: `Open a window and display the help of ${cmd} command.`,
			id: `help-command-${cmd}`,
			match: input => someStartsWith(['h', 'help'], input[0]) && `:${cmd}`.includes(input[1]),
			value: `help :${cmd}`,
		}))
	})(),
	...(function () {
		return preferencesKeys.map<SuggestionOption>(preference => ({
			command: `:h${optional('elp')} ${text(`'${preference}'`)}`,
			description: `Open a window and display the help of ${preference} preference.`,
			id: `help-preference-${preference}`,
			match: ([command = '', subcommand = '']) =>
				someStartsWith(['h', 'help'], command) &&
				`'${preference}'`.includes(subcommand.replaceAll("'", '')),
			value: `help '${preference}'`,
		}))
	})(),
	...(function () {
		return modesKeys.map<SuggestionOption>(mode => {
			const modeAbbreviator = mode[0]
			return {
				command: `:h${optional('elp')} ${modeAbbreviator}`,
				description: `Open a window and display the help of ${mode} mode.`,
				id: `help-mode-${mode}`,
				match: input =>
					someStartsWith(['h', 'help'], input[0]) && modeAbbreviator.includes(input[1]),
				value: `help ${modeAbbreviator}`,
			}
		})
	})(),
]

export const setSuggestions: SuggestionOption[] = [
	{
		command: `:se${optional('t')}`,
		description: 'Show all preferences that differ from their default value.',
		id: 'set-show-changed',
		match: input => someStartsWith(['se', 'set'], input[0]),
		value: 'set',
	},
	{
		// show all preferences
		command: `:se${optional('t')} all`,
		description: 'Show all preferences.',
		id: 'set-show-all',
		match: input => someStartsWith(['se', 'set'], input[0]) && 'all'.includes(input[1]),
		value: 'set all',
	},
	{
		// show all preferences
		command: `:se${optional('t')} all&`,
		description: 'Reset all preferences.',
		id: 'set-reset-all',
		match: input => someStartsWith(['se', 'set'], input[0]) && 'all&'.includes(input[1]),
		value: 'set all&',
	},
	...(function () {
		return preferencesKeys.map<SuggestionOption>(preference => ({
			command: `:se${optional('t')} ${pref(preference)}?`,
			description: `Show value of ${preference}.`,
			id: `set-show-preference-${preference}`,
			match: ([command = '', subcommand = '']) =>
				someStartsWith(['se', 'set'], command) && preference.includes(subcommand.split('?')[0]),
			value: `set ${preference}?`,
		}))
	})(),
	...(function () {
		return toggleKeys.map<SuggestionOption>(preference => ({
			command: `:se${optional('t')} ${pref(preference)}`,
			description: `Set, ${preference} switch it on.`,
			id: `set-switch-on-toggle-${preference}`,
			match: input => someStartsWith(['se', 'set'], input[0]) && preference.includes(input[1]),
			value: `set ${preference}`,
		}))
	})(),
	...(function () {
		return [...numberKeys, ...stringKeys].map<SuggestionOption>(preference => ({
			command: `:se${optional('t')} ${pref(preference)}`,
			description: `Show value of ${preference}.`,
			id: `set-show-number-string-${preference}`,
			match: input => someStartsWith(['se', 'set'], input[0]) && preference.includes(input[1]),
			value: `set ${preference}`,
		}))
	})(),
	...(function () {
		return toggleKeys.map<SuggestionOption>(preference => ({
			command: `:se${optional('t')} no${pref(preference)}`,
			description: `Reset, ${preference} switch it off.`,
			id: `set-switch-off-toggle-${preference}`,
			match: input =>
				someStartsWith(['se', 'set'], input[0]) && `no${preference}`.includes(input[1]),
			value: `set no${preference}`,
		}))
	})(),
	...(function () {
		return toggleKeys.map<SuggestionOption>(preference => ({
			command: `:se${optional('t')} ${pref(preference)}!`,
			description: `Invert value of ${preference}.`,
			id: `set-excl-toggle-${preference}`,
			match: ([command = '', subcommand = '']) =>
				someStartsWith(['se', 'set'], command) && preference.includes(subcommand.split('!')[0]),
			value: `set ${preference}!`,
		}))
	})(),
	...(function () {
		return toggleKeys.map<SuggestionOption>(preference => ({
			command: `:se${optional('t')} inv${pref(preference)}`,
			description: `Invert value of ${preference}.`,
			id: `set-invert-toggle-${preference}`,
			match: input =>
				someStartsWith(['se', 'set'], input[0]) && `inv${preference}`.includes(input[1]),
			value: `set ${preference}!`,
		}))
	})(),
	...(function () {
		return preferencesKeys.map<SuggestionOption>(preference => ({
			command: `:se${optional('t')} ${pref(preference)}&`,
			description: `Reset value of ${preference}.`,
			id: `set-reset-preference-${preference}`,
			match: ([command = '', subcommand = '']) =>
				someStartsWith(['se', 'set'], command) && preference.includes(subcommand.split('&')[0]),
			value: `set ${preference}&`,
		}))
	})(),
	...(function () {
		return [...numberKeys, ...stringKeys].map<SuggestionOption>(preference => ({
			command: `:se${optional('t')} ${pref(preference)}=${special('value')}`,
			description: `Set ${preference} to {value}.`,
			id: `set-equals-number-string-${preference}`,
			match: ([command = '', subcommand = '']) =>
				someStartsWith(['se', 'set'], command) && preference.includes(subcommand.split('=')[0]),
			value: `set ${preference}=`,
		}))
	})(),
	...(function () {
		return [...numberKeys, ...stringKeys].map<SuggestionOption>(preference => ({
			command: `:se${optional('t')} ${pref(preference)}:${special('value')}`,
			description: `Set ${preference} to {value}.`,
			id: `set-colon-number-string-${preference}`,
			match: ([command = '', subcommand = '']) =>
				someStartsWith(['se', 'set'], command) && preference.includes(subcommand.split(':')[0]),
			value: `set ${preference}:`,
		}))
	})(),
	{
		command: `:se${optional('t')} ${special('preference')}?`,
		description: 'Show value of {preference}.',
		id: 'set-show-preference',
		match: input => someStartsWith(['se', 'set'], input[0]),
		value: 'set ?',
		newSelection: [4, 4],
	},
	{
		command: `:se${optional('t')} ${special('preference')}`,
		description: 'Toggle preference: Set, switch it on.',
		id: 'set-switch-on-toggle',
		match: input => someStartsWith(['se', 'set'], input[0]),
		value: 'set ',
	},
	{
		command: `:se${optional('t')} ${special('preference')}`,
		description: 'Number or String preference: Show value.',
		id: 'set-show-number-string',
		match: input => someStartsWith(['se', 'set'], input[0]),
		value: 'set ',
	},
	{
		command: `:se${optional('t')} no${special('preference')}`,
		description: 'Toggle preference: Reset, switch it off.',
		id: 'set-switch-off-toggle',
		match: input => someStartsWith(['se', 'set'], input[0]),
		value: 'set no',
	},
	{
		command: `:se${optional('t')} ${special('preference')}!`,
		description: 'Toggle preference: Invert Value.',
		id: 'set-excl-toggle',
		match: input => someStartsWith(['se', 'set'], input[0]),
		value: 'set !',
		newSelection: [4, 4],
	},
	{
		command: `:se${optional('t')} inv${special('preference')}`,
		description: 'Toggle preference: Invert value.',
		id: 'set-invert-toggle',
		match: input => someStartsWith(['se', 'set'], input[0]),
		value: 'set inv',
	},
	{
		command: `:se${optional('t')} ${special('preference')}&`,
		description: "Reset option to it's default value.",
		id: 'set-reset-preference',
		match: input => someStartsWith(['se', 'set'], input[0]),
		value: 'set &',
		newSelection: [4, 4],
	},
]

export const suggestions: SuggestionOption[] = [
	...gameSuggestions,
	...helpSuggestions,
	...setSuggestions,
]

export interface IHistoryService {
	/**
	 * get Autocomplete History
	 */
	getAutocompleteHistory: () => string[]
	/**
	 * get current value
	 */
	getCurrent: () => string | null
	/**
	 * get All History
	 */
	getHistory: () => string[]
	push: (cmd: string) => void
	redo: () => void
	updateAutocomplete: (input?: string) => void
	undo: () => void
}
