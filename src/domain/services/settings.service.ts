import {
	defaultSettings,
	type ISettingsService,
	type Settings,
	type SettingUpdater,
	type ToggleKeys,
} from '../models'
import type { ISettingsRepo } from '../repositories'
import { type Observer } from '../utils'

export class SettingsService implements ISettingsService {
	#observers: Array<Observer<Settings>> = []
	#repo: ISettingsRepo

	constructor(repo: ISettingsRepo) {
		this.#repo = repo
	}

	get value() {
		return this.#repo.get()
	}

	static off: SettingUpdater<ToggleKeys> = () => false
	static on: SettingUpdater<ToggleKeys> = () => true
	static reset: SettingUpdater = ({ key }) => defaultSettings[key]
	static resetAll = (): Settings => ({ ...defaultSettings })
	static toggle: SettingUpdater<ToggleKeys> = ({ value }) => !value

	addObserver(observer: Observer<Settings>) {
		this.#observers = [...this.#observers, observer]
	}

	removeObserver(observer: Observer<Settings>) {
		this.#observers = this.#observers.filter(obs => obs !== observer)
	}

	updateAll(updater: (settings: Settings) => Settings) {
		this.#repo.update(oldPref => updater(oldPref))
		this.#notifyObservers()
	}

	updateByKey = <K extends keyof Settings>(key: K, updater: SettingUpdater<K>) => {
		this.#repo.update(oldPref => ({ ...oldPref, [key]: updater({ key, value: oldPref[key] }) }))
		this.#notifyObservers()
	}

	#notifyObservers() {
		const newValue = this.#repo.get()
		this.#observers.forEach(obs => {
			obs.update({ ...newValue })
		})
	}
}
