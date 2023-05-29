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

export interface IPreferencesService {
	getPreferences: () => Preferences
	setPreference: <T extends keyof Preferences>(key: T, newValue: Preferences[T]) => void
}

export const defaultPreferences: Preferences = {
	animations: true,
	automaticNoteDeletion: true,
	fontSize: 16,
	highlightNumber: true,
	history: 100,
	language: Langs.EN,
	mouse: MouseEnable.All,
	numbers: true,
	relativeNumbers: true,
	remainingNumbers: true,
	theme: Themes.Default,
	timer: true,
}
