import type { SuggestionOption } from '../models'

const initialPreferencesKeys: {
	toggleKeys: { name: string; preference: string }[]
	numberKeys: { name: string; preference: string }[]
	stringKeys: { name: string; preference: string }[]
} = {
	toggleKeys: [],
	numberKeys: [],
	stringKeys: [],
}

export function getKeysByType(preferences: Record<string, any>) {
	const entries = Object.entries(preferences)

	return entries.reduce((keys, [entryKey, entryValue]) => {
		const newKey = {
			name:
				entryKey[0].toUpperCase() + entryKey.substring(1).replace(/[A-Z]/g, match => ' ' + match),
			preference: entryKey.toLowerCase(),
		}
		if (typeof entryValue === 'boolean') keys.toggleKeys.push(newKey)
		else if (typeof entryValue === 'number') keys.numberKeys.push(newKey)
		else if (typeof entryValue === 'string') keys.stringKeys.push(newKey)
		else throw new TypeError('type of preference is invalid')
		return keys
	}, initialPreferencesKeys)
}

export const testCommands = {
	continue: (input: string) => 'continue'.includes(input),
	exit: (input: string) => 'exit'.includes(input),
	help: (input: string) => 'help'.includes(input),
	pause: (input: string) => 'pause'.includes(input),
	quit: (input: string) => 'quit'.includes(input),
	quitExcl: (input: string) => 'quit!'.includes(input),
	reset: (input: string) => 'reset'.includes(input),
	set: (input: string) => 'set'.includes(input),
	start: (input: string) => 'start'.includes(input),
	writeQuit: (input: string) => 'wquit'.includes(input),
	write: (input: string) => 'write'.includes(input),
	xit: (input: string) => 'xit'.includes(input),
	subCommand: (subcommand: string, input?: string, separator: string = '') => {
		if (input == null) return false
		if (subcommand.length < 2) return true
		return subcommand.includes(input.replaceAll(separator, ''))
	},
}

export const holder = (str: string) => `<span class=" text-surface-500-400-token">{${str}}</span>`
export const opt = (str: string) => `<span class="text-tertiary-600-300-token">[${str}]</span>`
export const pref = (str: string) => `<span class="text-secondary-600-300-token">${str}</span>`
export const text = (str: string) => `<span class="text-primary-500-400-token">${str}</span>`

export const mapKeys = <T>(arr: T[], mapFn: (value: T) => SuggestionOption) => arr.map(mapFn)

export const commandsPattern = [
	'(con(tinue)?)',
	'(exit?)',
	'(h(elp)?)',
	'(pau(se)?)',
	'(q(uit)?!)',
	'(q(uit)?)',
	'(res(et)?)',
	'(s(et)?)',
	'(st(art)?)',
	'(wq(uit)?)',
	'(w(rite)?)',
	'(x(it)?)',
].join('|')
