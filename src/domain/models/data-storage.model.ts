export interface DataStorageModel<T> {
	getActual: () => T
	update: (history: T) => void
}
