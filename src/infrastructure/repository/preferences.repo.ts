import type { Preferences } from '~/domain/models'
import type { DataStorageRepo } from '~/domain/repositories'

export class PreferencesStorage implements DataStorageRepo<Preferences> {
	#storage: DataStorageRepo<Preferences>

	constructor({ storage }: { storage: DataStorageRepo<Preferences> }) {
		this.#storage = storage
	}

	get = () => this.#storage.get()
	set = (data: Preferences) => this.#storage.set(data)
}
