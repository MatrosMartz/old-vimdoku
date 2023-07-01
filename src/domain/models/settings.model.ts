import type { Observable } from '../utils'

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
