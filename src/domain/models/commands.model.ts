import { getKeysByType, holder, opt, pref, testCommands, text } from '../utils'
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

const preferencesKeys = Object.keys(defaultPreferences).map(key => key.toLowerCase())
const { numberKeys, stringKeys, toggleKeys } = getKeysByType(defaultPreferences)
const modesKeys: Array<{ mode: Modes; letter: string }> = [
	{ mode: Modes.Annotation, letter: 'n' },
	{ mode: Modes.Command, letter: 'c' },
	{ mode: Modes.Insert, letter: 'i' },
	{ mode: Modes.Normal, letter: 'x' },
]
const difficultiesKeys = Object.keys(Difficulties)
	.filter(difficulty => Number.isNaN(Number(difficulty)))
	.map(difficulty => difficulty.toLowerCase())
export const commandsKeys = ['help', 'set', 'start', 'pause', 'reset', 'continue', 'quit']

export const gameSuggestions: SuggestionOption[] = [
	{
		command: `:pau${opt('se')}`,
		description: 'pause game',
		id: 'pause',
		match: input => testCommands.pause(input[0]),
		value: 'pause',
	},
	{
		command: `:res${opt('et')}`,
		description: 'reset game',
		id: 'reset',
		match: input => testCommands.reset(input[0]),
		value: 'reset',
	},
	{
		command: `:con${opt('tinue')}`,
		description: 'continue game',
		id: 'continue',
		match: input => testCommands.continue(input[0]),
		value: 'continue',
	},
	{
		command: `:st${opt('art')} ${holder('difficulty')}`,
		description: 'start sudoku game in difficulty selected',
		id: 'start-select',
		match: input => testCommands.start(input[0]),
		value: 'start ',
	},
	...(function () {
		return difficultiesKeys.map<SuggestionOption>(difficulty => ({
			command: `:st${opt('art')} ${difficulty}`,
			description: `start sudoku game in ${difficulty}`,
			id: `start-difficulty-${difficulty}`,
			match: input => testCommands.start(input[0]) && testCommands.subCommand(difficulty, input[1]),
			value: `start ${difficulty}`,
		}))
	})(),
]

export const helpSuggestions: SuggestionOption[] = [
	{
		command: `:h${opt('elp')}`,
		description: 'Open a window and display the help file in read-only mode.',
		id: 'help-main',
		match: input => testCommands.help(input[0]),
		value: 'help',
	},
	{
		command: `:h${opt('elp')} ${holder('subject')}`,
		description: 'Like ":help", additionally jump to the tag {subject}.',
		id: 'help-select',
		match: input => testCommands.help(input[0]),
		value: 'help ',
	},
	...(function () {
		return modesKeys.map<SuggestionOption>(({ mode, letter }) => ({
			command: `:h${opt('elp')} ${letter}`,
			description: `Open a window and display the help of ${mode} mode.`,
			id: `help-mode-${mode}`,
			match: input => testCommands.help(input[0]) && testCommands.subCommand(letter, input[1]),
			value: `help ${letter}`,
		}))
	})(),
	...(function () {
		return commandsKeys.map<SuggestionOption>(cmd => ({
			command: `:h${opt('elp')} <span class="text-secondary-600-300-token">:${cmd}</span>`,
			description: `Open a window and display the help of ${cmd} command.`,
			id: `help-command-${cmd}`,
			match: input =>
				testCommands.help(input[0]) && testCommands.subCommand(cmd, input[1], ':', true),
			value: `help :${cmd}`,
		}))
	})(),
	...(function () {
		return preferencesKeys.map<SuggestionOption>(preference => ({
			command: `:h${opt('elp')} ${text(`'${preference}'`)}`,
			description: `Open a window and display the help of ${preference} preference.`,
			id: `help-preference-${preference}`,
			match: input =>
				testCommands.help(input[0]) && testCommands.subCommand(preference, input[1], "'", true),
			value: `help '${preference}'`,
		}))
	})(),
]

export const setSuggestions: SuggestionOption[] = [
	{
		command: `:se${opt('t')}`,
		description: 'Show all preferences that differ from their default value.',
		id: 'set-show-changed',
		match: input => testCommands.set(input[0]),
		value: 'set',
	},
	{
		// show all preferences
		command: `:se${opt('t')} all`,
		description: 'Show all preferences.',
		id: 'set-show-all',
		match: input => testCommands.set(input[0]) && testCommands.subCommand('all', input[1]),
		value: 'set all',
	},
	{
		// show all preferences
		command: `:se${opt('t')} all&`,
		description: 'Reset all preferences.',
		id: 'set-reset-all',
		match: input => testCommands.set(input[0]) && testCommands.subCommand('all&', input[1]),
		value: 'set all&',
	},
	...(function () {
		return preferencesKeys.map<SuggestionOption>(preference => ({
			command: `:se${opt('t')} ${pref(preference)}?`,
			description: `Show value of ${preference}.`,
			id: `set-show-preference-${preference}`,
			match: input =>
				testCommands.set(input[0]) && testCommands.subCommand(preference, input[1], '?'),
			value: `set ${preference}?`,
		}))
	})(),
	...(function () {
		return toggleKeys.map<SuggestionOption>(preference => ({
			command: `:se${opt('t')} ${pref(preference)}`,
			description: `Set, ${preference} switch it on.`,
			id: `set-switch-on-toggle-${preference}`,
			match: input => testCommands.set(input[0]) && testCommands.subCommand(preference, input[1]),
			value: `set ${preference}`,
		}))
	})(),
	...(function () {
		return [...numberKeys, ...stringKeys].map<SuggestionOption>(preference => ({
			command: `:se${opt('t')} ${pref(preference)}`,
			description: `Show value of ${preference}.`,
			id: `set-show-number-string-${preference}`,
			match: input => testCommands.set(input[0]) && testCommands.subCommand(preference, input[1]),
			value: `set ${preference}`,
		}))
	})(),
	...(function () {
		return toggleKeys.map<SuggestionOption>(preference => ({
			command: `:se${opt('t')} no${pref(preference)}`,
			description: `Reset, ${preference} switch it off.`,
			id: `set-switch-off-toggle-${preference}`,
			match: input =>
				testCommands.set(input[0]) && testCommands.subCommand(`no${preference}`, input[1]),
			value: `set no${preference}`,
		}))
	})(),
	...(function () {
		return toggleKeys.map<SuggestionOption>(preference => ({
			command: `:se${opt('t')} ${pref(preference)}!`,
			description: `Invert value of ${preference}.`,
			id: `set-excl-toggle-${preference}`,
			match: input =>
				testCommands.set(input[0]) && testCommands.subCommand(preference, input[1], '!'),
			value: `set ${preference}!`,
		}))
	})(),
	...(function () {
		return toggleKeys.map<SuggestionOption>(preference => ({
			command: `:se${opt('t')} inv${pref(preference)}`,
			description: `Invert value of ${preference}.`,
			id: `set-invert-toggle-${preference}`,
			match: input =>
				testCommands.set(input[0]) && testCommands.subCommand(`inv${preference}`, input[1]),
			value: `set inv${preference}`,
		}))
	})(),
	...(function () {
		return preferencesKeys.map<SuggestionOption>(preference => ({
			command: `:se${opt('t')} ${pref(preference)}&`,
			description: `Reset value of ${preference}.`,
			id: `set-reset-preference-${preference}`,
			match: input =>
				testCommands.set(input[0]) && testCommands.subCommand(preference, input[1], '&'),
			value: `set ${preference}&`,
		}))
	})(),
	...(function () {
		return [...numberKeys, ...stringKeys].map<SuggestionOption>(preference => ({
			command: `:se${opt('t')} ${pref(preference)}=${holder('value')}`,
			description: `Set ${preference} to {value}.`,
			id: `set-equals-number-string-${preference}`,
			match: input =>
				testCommands.set(input[0]) && testCommands.subCommand(preference, input[1], '='),
			value: `set ${preference}=`,
		}))
	})(),
	...(function () {
		return [...numberKeys, ...stringKeys].map<SuggestionOption>(preference => ({
			command: `:se${opt('t')} ${pref(preference)}:${holder('value')}`,
			description: `Set ${preference} to {value}.`,
			id: `set-colon-number-string-${preference}`,
			match: input =>
				testCommands.set(input[0]) && testCommands.subCommand(preference, input[1], ':'),
			value: `set ${preference}:`,
		}))
	})(),
	{
		command: `:se${opt('t')} ${holder('preference')}?`,
		description: 'Show value of {preference}.',
		id: 'set-show-preference',
		match: input => testCommands.set(input[0]),
		value: 'set ?',
		newSelection: [4, 4],
	},
	{
		command: `:se${opt('t')} ${holder('preference')}`,
		description: 'Toggle preference: Set, switch it on.',
		id: 'set-switch-on-toggle',
		match: input => testCommands.set(input[0]),
		value: 'set ',
	},
	{
		command: `:se${opt('t')} ${holder('preference')}`,
		description: 'Number or String preference: Show value.',
		id: 'set-show-number-string',
		match: input => testCommands.set(input[0]),
		value: 'set ',
	},
	{
		command: `:se${opt('t')} no${holder('preference')}`,
		description: 'Toggle preference: Reset, switch it off.',
		id: 'set-switch-off-toggle',
		match: input => testCommands.set(input[0]),
		value: 'set no',
	},
	{
		command: `:se${opt('t')} ${holder('preference')}!`,
		description: 'Toggle preference: Invert Value.',
		id: 'set-excl-toggle',
		match: input => testCommands.set(input[0]),
		value: 'set !',
		newSelection: [4, 4],
	},
	{
		command: `:se${opt('t')} inv${holder('preference')}`,
		description: 'Toggle preference: Invert value.',
		id: 'set-invert-toggle',
		match: input => testCommands.set(input[0]),
		value: 'set inv',
	},
	{
		command: `:se${opt('t')} ${holder('preference')}&`,
		description: "Reset option to it's default value.",
		id: 'set-reset-preference',
		match: input => testCommands.set(input[0]),
		value: 'set &',
		newSelection: [4, 4],
	},
]

export const suggestions: SuggestionOption[] = [
	...helpSuggestions,
	...setSuggestions,
	...gameSuggestions,
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
