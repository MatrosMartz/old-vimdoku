import { Langs, MouseEnable, type Preferences, type PreferencesModel, Themes } from '../models'
import type { DataStorageRepo } from '../repositories'

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

export class PreferencesService implements PreferencesModel {
	#preferences = defaultPreferences
	#updateData = () => {}

	constructor(from?: DataStorageRepo<Preferences>) {
		if (from) {
			const newPreferences = from.get()
			if (newPreferences != null) this.#preferences = newPreferences

			this.#updateData = () => from.set(this.#preferences)
		}
	}
	getPreferences = () => this.#preferences
	setPreference = <T extends keyof Preferences>(preference: T, newValue: Preferences[T]) => {
		this.#preferences[preference] = newValue
		this.#updateData()
	}
}
