import type { Preferences } from '../models'

export interface IPreferencesRepo {
	get: () => Preferences
	update: (updater: (preferences: Preferences) => Preferences) => void
}
