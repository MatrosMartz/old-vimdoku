export interface IHistoryRepo {
	get: () => string[]
	update: (updater: (history: string[]) => string[]) => void
}
