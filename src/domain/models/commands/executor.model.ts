import { SettingsService } from '~/domain/services'
import { PreferenceError } from '~/domain/utils'

import {
	defaultSettings,
	type ISettingsService,
	type Langs,
	type MouseEnable,
	type NumberKeys,
	type Settings,
	type StringKeys,
	type Themes,
	type ToggleKeys,
} from '../settings.model'
import { Difficulties, type IBoardService } from '../sudoku'
import { type IVimScreenService, SetType } from '../vim-screen.model'
import {
	allPreferencesKeys,
	nonToggleKeys,
	numberKeys,
	stringKeys,
	toggleKeys,
} from './commands.model'

export const allPreferences = allPreferencesKeys.map(({ preference }) => preference).join('|')
export const togglePreferences = toggleKeys.map(({ preference }) => preference).join('|')
export const stringPreferences = stringKeys.map(({ preference }) => preference).join('|')
export const numberPreferences = numberKeys.map(({ preference }) => preference).join('|')
export const nonTogglePreferences = nonToggleKeys.map(({ preference }) => preference).join('|')

interface SubcommandOption {
	fn({
		preferences,
		subcommand,
		vimScreen,
		board,
	}: {
		board: IBoardService
		preferences: ISettingsService
		subcommand: string
		vimScreen: IVimScreenService
	}): void
	subPattern(subcommand: string): boolean
}

interface ExecutorOption {
	subcommandOption: SubcommandOption[]
	pattern(command: string): boolean
}

type settingsEntries<T extends keyof Settings = keyof Settings> = [T, Settings[T]]

export const executorOptions: ExecutorOption[] = [
	{
		pattern: command => /^set?$/.test(command),
		subcommandOption: [
			{
				subPattern: subcommand => subcommand == null,
				fn({ preferences, vimScreen }) {
					const changedPreferences = (
						Object.entries(preferences.value) as settingsEntries[]
					).filter(([key, value]) => value !== defaultSettings[key])

					console.log(changedPreferences)
					vimScreen.setSetsSecondary({ setType: SetType.diff })
				},
			},
			{
				subPattern: subcommand => /^all$/.test(subcommand),
				fn({ preferences, vimScreen }) {
					console.log(Object.entries(preferences.value))
					vimScreen.setSetsSecondary({ setType: SetType.all })
				},
			},
			{
				subPattern: subcommand => /^\w+\?$/.test(subcommand),
				fn({ preferences, subcommand }) {
					const preference = new RegExp(`^(${allPreferences})\\?$`).exec(subcommand)?.[1] as
						| keyof Settings
						| undefined
					if (preference == null) throw new PreferenceError()

					console.log([preference, preferences.value[preference]])
				},
			},
			{
				subPattern: subcommand => /^no\w+$/.test(subcommand),
				fn({ preferences, subcommand }) {
					const preference = new RegExp(`^no(${togglePreferences})$`).exec(subcommand)?.[1] as
						| ToggleKeys
						| undefined
					if (preference == null) throw new PreferenceError()

					preferences.updateByKey(preference, SettingsService.off)
				},
			},
			{
				subPattern: subcommand => /^(\w+!|inv\w+)$/.test(subcommand),
				fn({ preferences, subcommand }) {
					const result =
						new RegExp(`^(?:inv(${togglePreferences})|(${togglePreferences})!)$`).exec(
							subcommand
						) ?? []

					const preference = (result[1] ?? result[2]) as ToggleKeys | undefined
					if (preference == null) throw new PreferenceError()

					preferences.updateByKey(preference, SettingsService.toggle)
				},
			},
			{
				subPattern: subcommand => /^\w+&$/.test(subcommand),
				fn({ preferences, subcommand }) {
					const preference = new RegExp(`^(${togglePreferences})&$`).exec(subcommand)?.[1] as
						| keyof Settings
						| undefined
					if (preference == null) throw new PreferenceError()

					preferences.updateByKey(preference, SettingsService.reset)
				},
			},
			{
				subPattern: subcommand => /^(\w+[:=](?:(?:'[^']*')|(?:"[^"]*")))$/.test(subcommand),
				fn({ preferences, subcommand }) {
					const results =
						new RegExp(`^(${stringPreferences})[:=](?:'([^']'))|(?:"[^"]")$`).exec(subcommand) ?? []

					const preference = results[1] as StringKeys | undefined
					if (preference == null) throw new PreferenceError()

					const newValue = (results[2] ?? results[3]) as MouseEnable | Langs | Themes | undefined
					if (newValue == null) throw new PreferenceError({ kind: 'value' })

					preferences.updateByKey(preference, () => newValue)
				},
			},
			{
				subPattern: subcommand =>
					/^(\w+[:=](([1-9][\d_]*)|(?:0((?:x[a-fA-F\d_]*)|(?:o?[0-8_]*)|(?:b[01_]*)))))$/.test(
						subcommand
					),
				fn({ preferences, subcommand }) {
					const results =
						new RegExp(
							`^(${numberPreferences})[:=](([1-9][\\d_]*)|(?:0((?:x[a-fA-F\\d_]*)|(?:o?[0-7_]*)|(?:b[01_]*))))$`
						).exec(subcommand) ?? []

					const preference = results[1] as NumberKeys | undefined
					if (preference == null) throw new PreferenceError()

					const newValue = results[2] ?? results[3] ?? ''
					const parsedValue = /^0[0-7_]*/.test(newValue)
						? parseInt(newValue, 8)
						: /^0b[0-1_]*/.test(newValue)
						? parseInt(newValue.substring(2), 2)
						: parseInt(newValue)
					if (Number.isNaN(parsedValue)) throw new PreferenceError({ kind: 'value' })

					preferences.updateByKey(preference, () => parsedValue)
				},
			},
			{
				subPattern: subcommand => /^\w+$/.test(subcommand),
				fn({ preferences, subcommand }) {
					const preference = new RegExp(`^(${allPreferences})$`).exec(subcommand)?.[0] as
						| keyof Settings
						| undefined
					if (preference == null) throw new PreferenceError()

					if (nonTogglePreferences.includes(preference)) {
						console.log([preference, preferences.value[preference]])
					} else {
						preferences.updateByKey(preference as ToggleKeys, SettingsService.on)
					}
				},
			},
		],
	},
	{
		pattern: command => /^st(art)?$/.test(command),
		subcommandOption: [
			{
				subPattern: subcommand => /^beginner$/.test(subcommand),
				fn({ board, vimScreen }) {
					vimScreen.setGameWindow()
					board.initBoard({ difficulty: Difficulties.Beginner })
				},
			},
			{
				subPattern: subcommand => /^basic$/.test(subcommand),
				fn({ board, vimScreen }) {
					vimScreen.setGameWindow()
					board.initBoard({ difficulty: Difficulties.Basic })
				},
			},
			{
				subPattern: subcommand => /^easy$/.test(subcommand),
				fn({ board, vimScreen }) {
					vimScreen.setGameWindow()
					board.initBoard({ difficulty: Difficulties.Easy })
				},
			},
			{
				subPattern: subcommand => /^medium$/.test(subcommand),
				fn({ board, vimScreen }) {
					vimScreen.setGameWindow()
					board.initBoard({ difficulty: Difficulties.Medium })
				},
			},
			{
				subPattern: subcommand => /^advanced$/.test(subcommand),
				fn({ board, vimScreen }) {
					vimScreen.setGameWindow()
					board.initBoard({ difficulty: Difficulties.Advanced })
				},
			},
			{
				subPattern: subcommand => /^hard$/.test(subcommand),
				fn({ board, vimScreen }) {
					vimScreen.setGameWindow()
					board.initBoard({ difficulty: Difficulties.Hard })
				},
			},
			{
				subPattern: subcommand => /^expert$/.test(subcommand),
				fn({ board, vimScreen }) {
					vimScreen.setGameWindow()
					board.initBoard({ difficulty: Difficulties.Expert })
				},
			},
		],
	},
	{
		pattern: command => /^q(uit)?$/.test(command),
		subcommandOption: [
			{
				subPattern: subcommand => subcommand == null,
				fn({ vimScreen }) {
					vimScreen.undo()
				},
			},
		],
	},
	{
		pattern: command => /^wq(uit)?$/.test(command),
		subcommandOption: [
			{
				subPattern: subcommand => subcommand == null,
				fn({ vimScreen }) {
					vimScreen.undo()
				},
			},
		],
	},
	{
		pattern: command => /^q(uit)?!$/.test(command),
		subcommandOption: [
			{
				subPattern: subcommand => subcommand == null,
				fn({ vimScreen }) {
					vimScreen.undo()
				},
			},
		],
	},
	{
		pattern: command => /^x(it)?$/.test(command),
		subcommandOption: [
			{
				subPattern: subcommand => subcommand == null,
				fn({ vimScreen }) {
					vimScreen.undo()
				},
			},
		],
	},
	{
		pattern: command => /^exi(t)?$/.test(command),
		subcommandOption: [
			{
				subPattern: subcommand => subcommand == null,
				fn({ vimScreen }) {
					vimScreen.undo()
				},
			},
		],
	},
]

export interface ICmdExecutorService {
	exec(input: string): void
}
