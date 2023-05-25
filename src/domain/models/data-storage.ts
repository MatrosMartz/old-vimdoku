export interface DataStorage {
	getActual: () => string[]
	update: (history: string[]) => void
}
