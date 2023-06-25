import {
	type Preferences,
	type IPreferencesService,
	defaultPreferences,
	type PreferenceUpdater,
	type ToggleKeys,
} from '../models'
import type { IPreferencesRepo } from '../repositories'
import type { Observer } from '../utils'

export class PreferencesService implements IPreferencesService {
	static toggle: PreferenceUpdater<ToggleKeys> = ({ value }) => !value
	static on: PreferenceUpdater<ToggleKeys> = () => true
	static off: PreferenceUpdater<ToggleKeys> = () => false
	static reset: PreferenceUpdater = ({ key }) => defaultPreferences[key]
	static resetAll = (): Preferences => ({ ...defaultPreferences })

	#repo: IPreferencesRepo
	#observers: Observer<Preferences>[] = []

	constructor(repo: IPreferencesRepo) {
		this.#repo = repo
	}
	#notifyObservers() {
		const newValue = this.#repo.get()
		this.#observers.forEach(obs => obs.update({ ...newValue }))
	}
	addObserver(observer: Observer<Preferences>) {
		this.#observers.push(observer)
	}
	removeObserver(observer: Observer<Preferences>) {
		this.#observers = this.#observers.filter(obs => obs === observer)
	}
	getValue = () => this.#repo.get()
	updateAll(updater: (preferences: Preferences) => Preferences) {
		this.#repo.update(oldPref => updater(oldPref))
		this.#notifyObservers()
	}
	updateByKey = <K extends keyof Preferences>(key: K, updater: PreferenceUpdater<K>) => {
		this.#repo.update(oldPref => ({ ...oldPref, [key]: updater({ key, value: oldPref[key] }) }))
		this.#notifyObservers()
	}
}
