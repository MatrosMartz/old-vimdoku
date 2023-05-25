export interface DataStorageModel {
	getActual: () => string[]
	update: (history: string[]) => void
}
