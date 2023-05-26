import type { DataStorageRepo } from '~/domain/repositories'

export class HistoryStorage implements DataStorageRepo<string[]> {
	#storage: DataStorageRepo<string[]>
	constructor({ storage }: { storage: DataStorageRepo<string[]> }) {
		this.#storage = storage
	}

	get = () => this.#storage.get()
	set = (data: string[]) => this.#storage.set(data)
}
