import {
	Langs,
	MouseEnable,
	type Preferences,
	type IPreferencesService,
	Themes,
	defaultPreferences,
} from '../models'
import type { DataStorageRepo } from '../repositories'
import { noop } from '../utils'

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
