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
	value: Settings[K]
	key: K
}) => Settings[K]

type KeysByType<O, T> = {
	[K in keyof O]: O[K] extends T ? K : never
}[keyof O]

export type ToggleKeys = KeysByType<Settings, boolean>
export type NumberKeys = KeysByType<Settings, number>
export type StringKeys = KeysByType<Settings, string>

export interface ISettingsService extends Observable<Settings> {
	updateAll: (updater: (settings: Settings) => Settings) => void
	updateByKey: <K extends keyof Settings>(key: K, updater: SettingUpdater<K>) => void
}

export const defaultSettings: Settings = {
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
type FormField<T extends number | boolean | string> = T extends number
	? { type: 'number' }
	: T extends boolean
	? { type: 'boolean' }
	: { type: 'option'; enum: string[] }

type GroupFields<K extends keyof Settings> = [K, FormField<Settings[K]>][]

type SettingsForm = [
	['sudoku', GroupFields<keyof SudokuSettings>],
	['user', GroupFields<keyof UserSettings>],
	['vim', GroupFields<keyof VimSettings>]
]

export const settingsForm = [
	[
		'sudoku',
		[
			['automaticNoteDeletion', { type: 'boolean' }],
			['automaticValidation', { type: 'boolean' }],
			['highlightNumber', { type: 'boolean' }],
			['remainingNumbers', { type: 'boolean' }],
		],
	],
	[
		'user',
		[
			['animations', { type: 'boolean' }],
			['language', { type: 'option', enum: Object.values(Langs) }],
			['theme', { type: 'option', enum: Object.values(Themes) }],
			['timer', { type: 'boolean' }],
		],
	],
	[
		'vim',
		[
			['fontSize', { type: 'number' }],
			['history', { type: 'number' }],
			['mouse', { type: 'option', enum: Object.values(MouseEnable) }],
			['numbers', { type: 'boolean' }],
			['relativeNumbers', { type: 'boolean' }],
		],
	],
] satisfies SettingsForm
