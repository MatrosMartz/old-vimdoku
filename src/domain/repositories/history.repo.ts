import type { UpdaterRepo } from '../utils'

export interface IHistoryRepo {
	get: () => readonly string[]
	update: (updater: UpdaterRepo<string[]>) => void
}
