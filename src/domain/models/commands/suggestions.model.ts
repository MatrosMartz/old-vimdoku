import { holder, mapKeys, type Observable, opt, pref, testCommands, text } from '~/domain/utils'

import {
	allPreferencesKeys,
	commandsKeys,
	difficultiesKeys,
	modesKeys,
	nonToggleKeys,
	toggleKeys,
} from './commands.model'

export interface SuggestionOption {
	readonly newSelection?: [number, number]
	readonly command: string
	readonly description: string
	readonly id: string
	readonly value: string
	match(input: string[]): boolean
}

export const gameSuggestions: SuggestionOption[] = [
	{
		command: `:pau${opt('se')}`,
		description: 'pause game',
		id: 'pause-main',
		match: input => testCommands.pause(input[0]),
		value: 'pause',
	},
	{
		command: `:res${opt('et')}`,
		description: 'reset game',
		id: 'reset-main',
		match: input => testCommands.reset(input[0]),
		value: 'reset',
	},
	{
		command: `:con${opt('tinue')}`,
		description: 'continue game',
		id: 'continue-main',
		match: input => testCommands.continue(input[0]),
		value: 'continue',
	},
	{
		command: `:st${opt('art')} ${holder('difficulty')}`,
		description: 'start sudoku game in difficulty selected',
		id: 'start-sel',
		match: input => testCommands.start(input[0]),
		value: 'start ',
	},
	...mapKeys(difficultiesKeys, ([difficulty, value]) => {
		const diffLower = difficulty.toLowerCase()
		return {
			command: `:st${opt('art')} ${diffLower}`,
			description: `start sudoku game in ${difficulty}`,
			id: `start-sel-difficulty-${value}`,
			match: input => testCommands.start(input[0]) && testCommands.subCommand(diffLower, input[1]),
			value: `start ${diffLower}`,
		}
	}),
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
		id: 'help-sel',
		match: input => testCommands.help(input[0]),
		value: 'help ',
	},
	...mapKeys(modesKeys, ({ mode, letter }) => ({
		command: `:h${opt('elp')} ${letter}`,
		description: `Open a window and display the help of ${mode} mode.`,
		id: `help-sel-mode-${mode}`,
		match: input => testCommands.help(input[0]) && testCommands.subCommand(letter, input[1]),
		value: `help ${letter}`,
	})),
	...mapKeys(commandsKeys, cmd => ({
		command: `:h${opt('elp')} <span class="text-secondary-600-300-token">:${cmd}</span>`,
		description: `Open a window and display the help of ${cmd} command.`,
		id: `help-sel-command-${cmd}`,
		match: input => testCommands.help(input[0]) && testCommands.subCommand(cmd, input[1], ':'),
		value: `help :${cmd}`,
	})),
	...mapKeys(allPreferencesKeys, ({ preference, name }) => ({
		command: `:h${opt('elp')} ${text(`'${preference}'`)}`,
		description: `Open a window and display the help of ${name} preference.`,
		id: `help-sel-preference-${preference}`,
		match: input =>
			testCommands.help(input[0]) && testCommands.subCommand(preference, input[1], "'"),
		value: `help '${preference}'`,
	})),
]

export const setSuggestions: SuggestionOption[] = [
	{
		command: `:se${opt('t')}`,
		description: 'Show all preferences that differ from their default value.',
		id: 'set-main',
		match: input => testCommands.set(input[0]),
		value: 'set',
	},
	{
		command: `:se${opt('t')} all`,
		description: 'Show all preferences.',
		id: 'set-sel-all-show',
		match: input => testCommands.set(input[0]) && testCommands.subCommand('all', input[1]),
		value: 'set all',
	},
	{
		command: `:se${opt('t')} all&`,
		description: 'Reset all preferences.',
		id: 'set-sel-all-reset',
		match: input => testCommands.set(input[0]) && testCommands.subCommand('all&', input[1]),
		value: 'set all&',
	},
	...mapKeys(allPreferencesKeys, ({ preference, name }) => ({
		command: `:se${opt('t')} ${pref(preference)}?`,
		description: `Show value of ${name}.`,
		id: `set-sel-b-show-${preference}`,
		match: input =>
			testCommands.set(input[0]) && testCommands.subCommand(preference, input[1], '?'),
		value: `set ${preference}?`,
	})),
	...mapKeys(toggleKeys, ({ preference, name }) => ({
		command: `:se${opt('t')} ${pref(preference)}`,
		description: `Set, ${name} switch it on.`,
		id: `set-sel-c-on-${preference}`,
		match: input => testCommands.set(input[0]) && testCommands.subCommand(preference, input[1]),
		value: `set ${preference}`,
	})),
	...mapKeys(nonToggleKeys, ({ preference, name }) => ({
		command: `:se${opt('t')} ${pref(preference)}`,
		description: `Show value of ${name}.`,
		id: `set-sel-c-show-${preference}`,
		match: input => testCommands.set(input[0]) && testCommands.subCommand(preference, input[1]),
		value: `set ${preference}`,
	})),
	...mapKeys(toggleKeys, ({ preference, name }) => ({
		command: `:se${opt('t')} no${pref(preference)}`,
		description: `Reset, ${name} switch it off.`,
		id: `set-sel-d-off--${preference}`,
		match: input =>
			testCommands.set(input[0]) && testCommands.subCommand(`no${preference}`, input[1]),
		value: `set no${preference}`,
	})),
	...mapKeys(toggleKeys, ({ preference, name }) => ({
		command: `:se${opt('t')} ${pref(preference)}!`,
		description: `Invert value of ${name}.`,
		id: `set-sel-e-excl-${preference}`,
		match: input =>
			testCommands.set(input[0]) && testCommands.subCommand(preference, input[1], '!'),
		value: `set ${preference}!`,
	})),
	...mapKeys(toggleKeys, ({ preference, name }) => ({
		command: `:se${opt('t')} inv${pref(preference)}`,
		description: `Invert value of ${name}.`,
		id: `set-sel-e-invert-${preference}`,
		match: input =>
			testCommands.set(input[0]) && testCommands.subCommand(`inv${preference}`, input[1]),
		value: `set inv${preference}`,
	})),
	...mapKeys(allPreferencesKeys, ({ preference, name }) => ({
		command: `:se${opt('t')} ${pref(preference)}&`,
		description: `Reset value of ${name}.`,
		id: `set-sel-e-reset-${preference}`,
		match: input =>
			testCommands.set(input[0]) && testCommands.subCommand(preference, input[1], '&'),
		value: `set ${preference}&`,
	})),
	...mapKeys(nonToggleKeys, ({ preference, name }) => ({
		command: `:se${opt('t')} ${pref(preference)}=${holder('value')}`,
		description: `Set ${name} to {value}.`,
		id: `set-sel-f-equals-${preference}`,
		match: input =>
			testCommands.set(input[0]) && testCommands.subCommand(preference, input[1], '='),
		value: `set ${preference}=`,
	})),
	...mapKeys(nonToggleKeys, ({ preference, name }) => ({
		command: `:se${opt('t')} ${pref(preference)}:${holder('value')}`,
		description: `Set ${name} to {value}.`,
		id: `set-sel-f-colon-${preference}`,
		match: input =>
			testCommands.set(input[0]) && testCommands.subCommand(preference, input[1], ':'),
		value: `set ${preference}:`,
	})),
	{
		command: `:se${opt('t')} ${holder('preference')}?`,
		description: 'Show value of {preference}.',
		id: 'set-sel-u-show',
		match: input => testCommands.set(input[0]),
		value: 'set ?',
		newSelection: [4, 4],
	},
	{
		command: `:se${opt('t')} ${holder('preference')}`,
		description: 'Toggle preference: Set, switch it on.',
		id: 'set-sel-v-on',
		match: input => testCommands.set(input[0]),
		value: 'set ',
	},
	{
		command: `:se${opt('t')} ${holder('preference')}`,
		description: 'Number or String preference: Show value.',
		id: 'set-sel-v-show',
		match: input => testCommands.set(input[0]),
		value: 'set ',
	},
	{
		command: `:se${opt('t')} no${holder('preference')}`,
		description: 'Toggle preference: Reset, switch it off.',
		id: 'set-sel-w-off',
		match: input => testCommands.set(input[0]),
		value: 'set no',
	},
	{
		command: `:se${opt('t')} ${holder('preference')}!`,
		description: 'Toggle preference: Invert Value.',
		id: 'set-sel-x-excl',
		match: input => testCommands.set(input[0]),
		value: 'set !',
		newSelection: [4, 4],
	},
	{
		command: `:se${opt('t')} inv${holder('preference')}`,
		description: 'Toggle preference: Invert value.',
		id: 'set-sel-x-invert',
		match: input => testCommands.set(input[0]),
		value: 'set inv',
	},
	{
		command: `:se${opt('t')} ${holder('preference')}&`,
		description: "Reset option to it's default value.",
		id: 'set-sel-u-reset',
		match: input => testCommands.set(input[0]),
		value: 'set &',
		newSelection: [4, 4],
	},
]

export const quitSuggestions: SuggestionOption[] = [
	{
		command: `:q${opt('uit')}`,
		description: 'Quit the current windows.',
		id: 'quit-main',
		match: input => testCommands.quit(input[0]),
		value: 'quit',
	},
	{
		command: `:q${opt('uit')}!`,
		description: 'Quit without save, also when the current game has changes.',
		id: 'quit-unsaved',
		match: input => testCommands.quitExcl(input[0]),
		value: 'quit!',
	},
	{
		command: `:wq${opt('uit')}`,
		description: 'Save the current game and close the windows.',
		id: 'quit-save',
		match: input => testCommands.writeQuit(input[0]),
		value: 'wquit',
	},
	{
		command: `:w${opt('rite')}`,
		description: 'Save the current game.',
		id: 'save-main',
		match: input => testCommands.write(input[0]),
		value: 'write',
	},
	{
		command: `:x${opt('it')}`,
		description: 'Like ":wq", but save only when changes have been made.',
		id: 'xit-main',
		match: input => testCommands.xit(input[0]),
		value: 'xit',
	},
	{
		command: `:exi${opt('t')}`,
		description: 'Like ":wq", but save only when changes have been made.',
		id: 'exit-main',
		match: input => testCommands.exit(input[0]),
		value: 'xit',
	},
]

export const suggestions: SuggestionOption[] = [
	...helpSuggestions,
	...setSuggestions,
	...gameSuggestions,
	...quitSuggestions,
]
	.sort(({ id: id1 }, { id: id2 }) => Number(id1 > id2) - 1)
	.map(sub => Object.freeze(sub))

export interface ICmdSuggestionsService extends Observable<SuggestionOption[]> {
	update(string: string): void
}
