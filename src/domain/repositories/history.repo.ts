export interface IHistoryRepo {
	get: () => readonly string[]
	update: (updater: (history: string[]) => string[]) => void
}
