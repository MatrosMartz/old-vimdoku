import { writable } from 'svelte/store'

import { PreferencesService } from '~/domain/services/preferences.service'
import type { Preferences } from '~/domain/models'

import { DataStorageBrowser } from '$infra/browser/repositories/local-storage.repo'

const preferencesRepo = new DataStorageBrowser<Preferences>({ keyName: 'preferences' })
export const preferences = new PreferencesService(preferencesRepo)

function createPreferencesStore() {
	const { subscribe, set } = writable(preferences.getPreferences())

	const setPreference = <T extends keyof Preferences>(preference: T, value: Preferences[T]) => {
		preferences.setPreference(preference, value)
		set(preferences.getPreferences())
	}

	return { subscribe, setPreference }
}

export const preferencesStore = createPreferencesStore()
