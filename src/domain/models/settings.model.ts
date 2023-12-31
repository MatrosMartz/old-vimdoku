import type { Observable } from '../utils'

export enum Themes {
	Default = 'default',
}
export enum Langs {
	EN = 'en',
	ES = 'es',
}
export enum MouseEnable {
	All = 'a',
	CommandLine = 'c',
	Insert = 'i',
	Normal = 'n',
	Visual = 'v',
}

export interface VimSettings {
	fontSize: number
	history: number
	mouse: MouseEnable
	numbers: boolean
	relativeNumbers: boolean
}

export interface SudokuSettings {
	automaticNoteDeletion: boolean
	automaticValidation: boolean
	highlightNumber: boolean
	remainingNumbers: boolean
}

export interface UserSettings {
	animations: boolean
	language: Langs
	theme: Themes
	timer: boolean
}

export interface Settings extends VimSettings, SudokuSettings, UserSettings {}

export type SettingUpdater<K extends keyof Settings = keyof Settings> = (args: {
	key: K
	value: Settings[K]
}) => Settings[K]

type KeysByType<O, T> = {
	[K in keyof O]: O[K] extends T ? K : never
}[keyof O]

export type ToggleKeys = KeysByType<Settings, boolean>
export type NumberKeys = KeysByType<Settings, number>
export type StringKeys = KeysByType<Settings, string>

export interface ISettingsService extends Observable<Settings> {
	updateAll(updater: (settings: Settings) => Settings): void
	updateByKey<K extends keyof Settings>(key: K, updater: SettingUpdater<K>): void
}

const defaultSudokuSettings: SudokuSettings = {
	automaticNoteDeletion: true,
	automaticValidation: false,
	highlightNumber: true,
	remainingNumbers: true,
}
const defaultUserSettings: UserSettings = {
	animations: true,
	language: Langs.EN,
	theme: Themes.Default,
	timer: true,
}
const defaultVimSettings: VimSettings = {
	fontSize: 16,
	history: 100,
	mouse: MouseEnable.All,
	numbers: true,
	relativeNumbers: false,
}

export const sudokuSettingsKeys = Object.keys(defaultSudokuSettings)
export const userSettingsKeys = Object.keys(defaultUserSettings)
export const vimSettingsKeys = Object.keys(defaultVimSettings)

export const defaultSettings: Settings = {
	...defaultSudokuSettings,
	...defaultUserSettings,
	...defaultVimSettings,
}
type FormField<T extends number | boolean | string> = T extends number
	? { type: 'number' }
	: T extends boolean
	? { type: 'boolean' }
	: { options: string[]; type: 'option' }

type GroupFields<K extends keyof Settings> = Array<FormField<Settings[K]> & { key: K }>

type SettingsForm = [
	['Sudoku', GroupFields<keyof SudokuSettings>],
	['User', GroupFields<keyof UserSettings>],
	['Vim', GroupFields<keyof VimSettings>]
]

export const settingsForm = [
	[
		'Sudoku',
		[
			{ key: 'automaticNoteDeletion', type: 'boolean' },
			{ key: 'automaticValidation', type: 'boolean' },
			{ key: 'highlightNumber', type: 'boolean' },
			{ key: 'remainingNumbers', type: 'boolean' },
		],
	],
	[
		'User',
		[
			{ key: 'animations', type: 'boolean' },
			{ key: 'language', type: 'option', options: Object.values(Langs) },
			{ key: 'theme', type: 'option', options: Object.values(Themes) },
			{ key: 'timer', type: 'boolean' },
		],
	],
	[
		'Vim',
		[
			{ key: 'fontSize', type: 'number' },
			{ key: 'history', type: 'number' },
			{ key: 'mouse', type: 'option', options: Object.values(MouseEnable) },
			{ key: 'numbers', type: 'boolean' },
			{ key: 'relativeNumbers', type: 'boolean' },
		],
	],
] satisfies SettingsForm
