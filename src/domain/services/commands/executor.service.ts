import {
	defaultPreferences,
	type ICmdExecutorService,
	type Preferences,
	allPreferences,
	nonTogglePreferences,
	type ToggleKeys,
} from '~/domain/models'
import { PreferencesService } from '../preferences.service'

type PreferencesEntries<T extends keyof Preferences = keyof Preferences> = [T, Preferences[T]]

export class CmdExecutorService implements ICmdExecutorService {
	#preferences: PreferencesService
	constructor({ preferences }: { preferences: PreferencesService }) {
		this.#preferences = preferences
	}
	exec(input: string) {
		const [cmd, subcommand] = input.trim().split(/\s+/)

		if (/^set?$/.test(cmd)) {
			if (subcommand == null) {
				const changedPreferences = (
					Object.entries(this.#preferences.getValue()) as PreferencesEntries[]
				).filter(([key, value]) => value === defaultPreferences[key])

				console.log(changedPreferences)
			} else if (/^all$/.test(subcommand)) {
				console.log(Object.entries(this.#preferences.getValue()))
			} else if (/^\\w+\?$/.test(subcommand)) {
				const preference = new RegExp(`^(${allPreferences.join('|')})\?$`).exec(subcommand)?.[0] as
					| keyof Preferences
					| undefined

				if (preference == null || !allPreferences.includes(preference))
					throw new Error('es un commando incorrect')

				console.log([preference, this.#preferences.getValue()[preference]])
			}
		} else if (/^\\w+$/.test(subcommand)) {
			const preference = new RegExp(`^(${allPreferences.join('|')})$`).exec(subcommand)?.[0] as
				| keyof Preferences
				| undefined

			if (preference == null || !allPreferences.includes(preference))
				throw new Error('es un commando incorrect')

			if (nonTogglePreferences.includes(preference))
				console.log([preference, this.#preferences.getValue()[preference]])
			else {
				this.#preferences.updateByKey(preference as ToggleKeys, PreferencesService.on)
			}
		}
	}
}
