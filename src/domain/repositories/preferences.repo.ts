import type { Preferences } from '../models'

export interface IPreferencesRepo {
	get: () => Readonly<Preferences>
	update: (updater: (preferences: Preferences) => Preferences) => void
}
