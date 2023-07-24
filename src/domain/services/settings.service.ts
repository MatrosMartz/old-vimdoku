import {
	type Settings,
	type ISettingsService,
	defaultSettings,
	type SettingUpdater,
	type ToggleKeys,
} from '../models'
import type { ISettingsRepo } from '../repositories'
import { type Observer } from '../utils'

export class SettingsService implements ISettingsService {
	static toggle: SettingUpdater<ToggleKeys> = ({ value }) => !value
	static on: SettingUpdater<ToggleKeys> = () => true
	static off: SettingUpdater<ToggleKeys> = () => false
	static reset: SettingUpdater = ({ key }) => defaultSettings[key]
	static resetAll = (): Settings => ({ ...defaultSettings })

	#repo: ISettingsRepo
	#observers: Observer<Settings>[] = []

	constructor(repo: ISettingsRepo) {
		this.#repo = repo
	}

	#notifyObservers() {
		const newValue = this.#repo.get()
		this.#observers.forEach(obs => obs.update({ ...newValue }))
	}
	addObserver(observer: Observer<Settings>) {
		this.#observers = [...this.#observers, observer]
	}
	removeObserver(observer: Observer<Settings>) {
		this.#observers = this.#observers.filter(obs => obs !== observer)
	}
	get value() {
		return this.#repo.get()
	}

	updateAll(updater: (settings: Settings) => Settings) {
		this.#repo.update(oldPref => updater(oldPref))
		this.#notifyObservers()
	}
	updateByKey = <K extends keyof Settings>(key: K, updater: SettingUpdater<K>) => {
		this.#repo.update(oldPref => ({ ...oldPref, [key]: updater({ key, value: oldPref[key] }) }))
		this.#notifyObservers()
	}
}
