import { defaultSettings, type Settings } from '~/domain/models'
import type { DataRepo, ISettingsRepo } from '~/domain/repositories'

export class SettingsRepo implements ISettingsRepo {
	#settings = { ...defaultSettings }
	#storage: DataRepo<Settings>

	constructor({ storage }: { storage: DataRepo<Settings> }) {
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
