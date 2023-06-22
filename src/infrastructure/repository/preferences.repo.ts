import { defaultPreferences, type Preferences } from '~/domain/models'
import type { DataStorageRepo, IPreferencesRepo } from '~/domain/repositories'

export class PreferencesRepo implements IPreferencesRepo {
	#storage: DataStorageRepo<Preferences>
	#preferences = { ...defaultPreferences }

	constructor({ storage }: { storage: DataStorageRepo<Preferences> }) {
		this.#storage = storage
	}

	get() {
		this.#preferences = { ...(this.#storage.get() ?? this.#preferences) }

		return Object.freeze(this.#preferences)
	}
	update(updater: (preferences: Preferences) => Preferences) {
		this.#storage.set(updater(this.#preferences))
	}
}
