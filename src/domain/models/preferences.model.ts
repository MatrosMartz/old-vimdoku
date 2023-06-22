export const enum Themes {
	Default = 'default',
}
export const enum Langs {
	EN = 'en',
	ES = 'es',
}
export const enum MouseEnable {
	All = 'a',
	CommandLine = 'c',
	Insert = 'i',
	Normal = 'n',
	Visual = 'v',
}

export interface VimPreferences {
	fontSize: number
	history: number
	mouse: MouseEnable
	numbers: boolean
	relativeNumbers: boolean
}

export interface SudokuPreferences {
	automaticNoteDeletion: boolean
	automaticValidation: boolean
	highlightNumber: boolean
	remainingNumbers: boolean
}

export interface UserPreferences {
	animations: boolean
	language: Langs
	theme: Themes
	timer: boolean
}

export interface Preferences extends VimPreferences, SudokuPreferences, UserPreferences {}

export type PreferenceUpdater<K extends keyof Preferences = keyof Preferences> = (args: {
	value: Preferences[K]
	key: K
}) => Preferences[K]

type KeysByType<O, T> = {
	[K in keyof O]: O[K] extends T ? K : never
}[keyof O]

export type ToggleKeys = KeysByType<Preferences, boolean>
export type NumberKeys = KeysByType<Preferences, number>
export type StringKeys = KeysByType<Preferences, string>

export interface IPreferencesService {
	getPreferences: () => Preferences
	updateAll: (updater: (preferences: Preferences) => Preferences) => void
	updatePreference: <K extends keyof Preferences>(key: K, updater: PreferenceUpdater<K>) => void
}

export const defaultPreferences: Preferences = {
	animations: true,
	automaticNoteDeletion: true,
	automaticValidation: false,
	fontSize: 16,
	highlightNumber: true,
	history: 100,
	language: Langs.EN,
	mouse: MouseEnable.All,
	numbers: true,
	relativeNumbers: false,
	remainingNumbers: true,
	theme: Themes.Default,
	timer: true,
}
