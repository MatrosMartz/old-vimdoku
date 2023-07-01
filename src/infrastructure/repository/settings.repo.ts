import { defaultSettings, type Settings } from '~/domain/models'
import type { DataStorageRepo, ISettingsRepo } from '~/domain/repositories'

export class SettingsRepo implements ISettingsRepo {
	#storage: DataStorageRepo<Settings>
	#settings = { ...defaultSettings }

	constructor({ storage }: { storage: DataStorageRepo<Settings> }) {
		this.#storage = storage
	}

	get() {
		this.#settings = { ...(this.#storage.get() ?? this.#settings) }

		return Object.freeze(this.#settings)
	}
	update(updater: (settings: Settings) => Settings) {
		this.#storage.set(updater(this.#settings))
	}
}
