import { writable } from 'svelte/store'

import { PreferencesService } from '~/domain/services/preferences.service'
import type { PreferenceUpdater, Preferences } from '~/domain/models'

import { DataStorageBrowser } from '$infra/browser/repositories/local-storage.repo'

const preferencesRepo = new DataStorageBrowser<Preferences>({ keyName: 'preferences' })
export const preferences = new PreferencesService(preferencesRepo)

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
