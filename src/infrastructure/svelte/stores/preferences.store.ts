import { writable } from 'svelte/store'

import { PreferencesService } from '~/domain/services'
import type { PreferenceUpdater, Preferences } from '~/domain/models'
import type { CustomSubscribe, Observer } from '~/domain/utils'

import { DataStorageBrowser } from '$infra/browser/repositories/local-storage.repo'
import { PreferencesRepo } from '$infra/repository/preferences.repo'

const preferencesStorage = new DataStorageBrowser<Preferences>({ keyName: 'preferences' })
export const preferences = new PreferencesService(
	new PreferencesRepo({ storage: preferencesStorage })
)

function createPreferencesStore() {
	const { subscribe: storeSubscribe, set } = writable(preferences.getValue())

	const updateAll = (updater: (preferences: Preferences) => Preferences) => {
		preferences.updateAll(updater)
	}
	const updatePreference = <T extends keyof Preferences>(
		preferenceKey: T,
		updater: PreferenceUpdater<T>
	) => {
		preferences.updateByKey(preferenceKey, updater)
	}

	const observerStore: Observer<Preferences> = {
		update: value => set(value),
	}

	const subscribe: CustomSubscribe<Preferences> = run => {
		preferences.addObserver(observerStore)
		const storeUnsubscribe = storeSubscribe(run)

		return () => {
			preferences.removeObserver(observerStore)
			storeUnsubscribe()
		}
	}

	return { subscribe, updateAll, updatePreference }
}

export const preferencesStore = createPreferencesStore()
