import {
	type Preferences,
	type IPreferencesService,
	defaultPreferences,
	type PreferenceUpdater,
	type ToggleKeys,
} from '../models'
import type { IPreferencesRepo } from '../repositories'

export class PreferencesService implements IPreferencesService {
	static toggle: PreferenceUpdater<ToggleKeys> = ({ value }) => !value
	static on: PreferenceUpdater<ToggleKeys> = () => true
	static off: PreferenceUpdater<ToggleKeys> = () => false
	static reset: PreferenceUpdater = ({ key }) => defaultPreferences[key]
	static resetAll = () => ({ ...defaultPreferences })

	#repo: IPreferencesRepo

	constructor(repo: IPreferencesRepo) {
		this.#repo = repo
	}
	getPreferences = () => this.#repo.get()
	updateAll(updater: (preferences: Preferences) => Preferences) {
		this.#repo.update(oldPref => updater(oldPref))
	}
	updatePreference = <K extends keyof Preferences>(key: K, updater: PreferenceUpdater<K>) => {
		this.#repo.update(oldPref => ({ ...oldPref, [key]: updater({ key, value: oldPref[key] }) }))
	}
}
