import type { DataStorageRepo, IHistoryRepo } from '~/domain/repositories'

export class HistoryRepo implements IHistoryRepo {
	#history: string[] = []
	#storage: DataStorageRepo<string[]>
	constructor({ storage }: { storage: DataStorageRepo<string[]> }) {
		this.#storage = storage
	}

	get() {
		this.#history = [...(this.#storage.get() ?? this.#history)]

		return Object.freeze(this.#history)
	}
	update(updater: (history: string[]) => string[]) {
		this.#storage.set(updater(this.#history))
	}
}
