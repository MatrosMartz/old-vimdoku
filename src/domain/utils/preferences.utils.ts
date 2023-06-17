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
