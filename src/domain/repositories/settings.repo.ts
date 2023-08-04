import type { Settings } from '../models'
import type { UpdaterRepo } from '../utils'

export interface ISettingsRepo {
	get: () => Readonly<Settings>
	update: (updater: UpdaterRepo<Settings>) => void
}
