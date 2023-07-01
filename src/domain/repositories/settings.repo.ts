import type { Settings } from '../models'

export interface ISettingsRepo {
	get: () => Readonly<Settings>
	update: (updater: (settings: Settings) => Settings) => void
}
