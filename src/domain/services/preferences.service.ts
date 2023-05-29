import { Langs, MouseEnable, type Preferences, type IPreferencesService, Themes } from '../models'
import type { DataStorageRepo } from '../repositories'
import { noop } from '../utils'

const defaultPreferences: Preferences = {
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

export class PreferencesService implements IPreferencesService {
	#preferences = defaultPreferences
	#updateData = noop

	constructor(repo?: DataStorageRepo<Preferences>) {
		if (repo) {
			const newPreferences = repo.get()
			if (newPreferences != null) this.#preferences = newPreferences

			this.#updateData = () => repo.set(this.#preferences)
		}
	}
	getPreferences = () => this.#preferences
	setPreference = <T extends keyof Preferences>(preference: T, newValue: Preferences[T]) => {
		this.#preferences[preference] = newValue
		this.#updateData()
	}
}
