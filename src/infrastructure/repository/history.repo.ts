import type { DataStorageRepo, IHistoryRepo } from '~/domain/repositories'

export class HistoryRepo implements IHistoryRepo {
	#history: string[] = []
	#storage: DataStorageRepo<string[]>
	constructor({ storage }: { storage: DataStorageRepo<string[]> }) {
		this.#storage = storage
	}

	get() {
		const newHistory = this.#storage.get()
		if (newHistory != null) this.#history = newHistory

		return this.#history
	}
	update(updater: (history: string[]) => string[]) {
		this.#storage.set(updater(this.#history))
	}
}
