import {
	Langs,
	type DataStorageModel,
	MouseEnable,
	type Preferences,
	type PreferencesModel,
	Themes,
} from '../models'

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
	#updateData: ((preferences: Preferences) => void) | null = null

	constructor(from?: DataStorageModel<Preferences>) {
		if (from) {
			this.#preferences = from.getActual()
			this.#updateData = from.update
		}
	}
	getPreferences = () => this.#preferences
	setPreference = <T extends keyof Preferences>(preference: T, newValue: Preferences[T]) => {
		this.#preferences[preference] = newValue
		this.#updateData?.(this.#preferences)
	}
}
