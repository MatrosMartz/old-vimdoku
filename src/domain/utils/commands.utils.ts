const initialPreferencesKeys: {
	toggleKeys: string[]
	numberKeys: string[]
	stringKeys: string[]
} = {
	toggleKeys: [],
	numberKeys: [],
	stringKeys: [],
}

export function getKeysByType(preferences: Record<string, any>) {
	const entries = Object.entries(preferences)

	return entries.reduce((keys, [entryKey, entryValue]) => {
		if (typeof entryValue === 'boolean') keys.toggleKeys.push(entryKey.toLowerCase())
		else if (typeof entryValue === 'number') keys.numberKeys.push(entryKey.toLowerCase())
		else if (typeof entryValue === 'string') keys.stringKeys.push(entryKey.toLowerCase())
		else throw new TypeError('type of preference is invalid')
		return keys
	}, initialPreferencesKeys)
}

export const testCommands = {
	continue: (input: string) => 'continue'.includes(input),
	help: (input: string) => 'help'.includes(input),
	pause: (input: string) => 'pause'.includes(input),
	quit: (input: string) => 'quit'.includes(input),
	reset: (input: string) => 'reset'.includes(input),
	set: (input: string) => 'set'.includes(input),
	start: (input: string) => 'start'.includes(input),
	subCommand: (
		subcommand: string,
		input?: string,
		separator: string = '',
		remove: boolean = false
	) => {
		if (input == null) return false
		if (remove) return subcommand.includes(input.replaceAll(separator, ''))
		return subcommand.includes(input.split(separator)[0])
	},
}

export const holder = (str: string) => `<span class="text-surface-500-400-token">{${str}}</span>`
export const opt = (str: string) => `<span class="text-tertiary-600-300-token">[${str}]</span>`
export const pref = (str: string) => `<span class="text-secondary-600-300-token">${str}</span>`
export const text = (str: string) => `<span class="text-primary-500-400-token">${str}</span>`
