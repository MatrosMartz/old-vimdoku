import { PreferenceError } from '~/domain/utils'
import {
	defaultPreferences,
	MouseEnable,
	type IPreferencesService,
	type Preferences,
	type StringKeys,
	type ToggleKeys,
	Langs,
	Themes,
	type NumberKeys,
} from '../preferences.model'
import {
	allPreferencesKeys,
	nonToggleKeys,
	numberKeys,
	stringKeys,
	toggleKeys,
} from './commands.model'
import { PreferencesService } from '~/domain/services'

export const allPreferences = allPreferencesKeys.map(({ preference }) => preference).join('|')
export const togglePreferences = toggleKeys.map(({ preference }) => preference).join('|')
export const stringPreferences = stringKeys.map(({ preference }) => preference).join('|')
export const numberPreferences = numberKeys.map(({ preference }) => preference).join('|')
export const nonTogglePreferences = nonToggleKeys.map(({ preference }) => preference).join('|')

interface SubcommandOption {
	subPattern: (subcommand: string) => boolean
	fn: ({
		preferences,
		subcommand,
	}: {
		preferences: IPreferencesService
		subcommand: string
	}) => void
}

interface ExecutorOption {
	pattern: (command: string) => boolean
	subcommandOption: SubcommandOption[]
}

type PreferencesEntries<T extends keyof Preferences = keyof Preferences> = [T, Preferences[T]]

export const executorOptions: ExecutorOption[] = [
	{
		pattern: command => /^set?$/.test(command),
		subcommandOption: [
			{
				subPattern: subcommand => subcommand == null,
				fn({ preferences }) {
					const changedPreferences = (
						Object.entries(preferences.getValue()) as PreferencesEntries[]
					).filter(([key, value]) => value === defaultPreferences[key])

					console.log(changedPreferences)
				},
			},
			{
				subPattern: subcommand => /^all$/.test(subcommand),
				fn({ preferences }) {
					console.log(Object.entries(preferences.getValue()))
				},
			},
			{
				subPattern: subcommand => /^\w+\?$/.test(subcommand),
				fn({ preferences, subcommand }) {
					const preference = new RegExp(`^(${allPreferences})\\?$`).exec(subcommand)?.[1] as
						| keyof Preferences
						| undefined
					if (preference == null) throw new PreferenceError()

					console.log([preference, preferences.getValue()[preference]])
				},
			},
			{
				subPattern: subcommand => /^no\w+$/.test(subcommand),
				fn({ preferences, subcommand }) {
					const preference = new RegExp(`^no(${togglePreferences})$`).exec(subcommand)?.[1] as
						| ToggleKeys
						| undefined
					if (preference == null) throw new PreferenceError()

					preferences.updateByKey(preference, PreferencesService.off)
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

					preferences.updateByKey(preference, PreferencesService.toggle)
				},
			},
			{
				subPattern: subcommand => /^\w+&$/.test(subcommand),
				fn({ preferences, subcommand }) {
					const preference = new RegExp(`^(${togglePreferences})&$`).exec(subcommand)?.[1] as
						| keyof Preferences
						| undefined
					if (preference == null) throw new PreferenceError()

					preferences.updateByKey(preference, PreferencesService.reset)
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
						| keyof Preferences
						| undefined
					if (preference == null) throw new PreferenceError()

					if (nonTogglePreferences.includes(preference))
						console.log([preference, preferences.getValue()[preference]])
					else {
						preferences.updateByKey(preference as ToggleKeys, PreferencesService.on)
					}
				},
			},
		],
	},
]

export interface ICmdExecutorService {
	exec: (input: string) => void
}
