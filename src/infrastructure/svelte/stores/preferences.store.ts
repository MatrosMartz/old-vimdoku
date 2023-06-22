import { writable } from 'svelte/store'

import { PreferencesService } from '~/domain/services'
import type { PreferenceUpdater, Preferences } from '~/domain/models'

import { DataStorageBrowser } from '$infra/browser/repositories/local-storage.repo'
import { PreferencesRepo } from '$infra/repository/preferences.repo'

const preferencesStorage = new DataStorageBrowser<Preferences>({ keyName: 'preferences' })
export const preferences = new PreferencesService(
	new PreferencesRepo({ storage: preferencesStorage })
)

function createPreferencesStore() {
	const { subscribe, set } = writable(preferences.getPreferences())

	const updatePreference = <T extends keyof Preferences>(
		preferenceKey: T,
		updater: PreferenceUpdater<T>
	) => {
		preferences.updatePreference(preferenceKey, updater)
		set(preferences.getPreferences())
	}

	return { subscribe, updatePreference }
}

export const preferencesStore = createPreferencesStore()
