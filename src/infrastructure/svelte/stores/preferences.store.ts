import { readable } from 'svelte/store'

import { CmdExecutorService, PreferencesService } from '~/domain/services'
import type { Preferences } from '~/domain/models'
import type { Observer } from '~/domain/utils'

import { DataStorageBrowser } from '$infra/browser/repositories/local-storage.repo'
import { PreferencesRepo } from '$infra/repository/preferences.repo'

const preferencesStorage = new DataStorageBrowser<Preferences>({ keyName: 'preferences' })
export const preferences = new PreferencesService(
	new PreferencesRepo({ storage: preferencesStorage })
)

export const executor = new CmdExecutorService({ preferences })

export const preferencesStore = readable(preferences.getValue(), set => {
	const observer: Observer<Preferences> = { update: value => set(value) }

	preferences.addObserver(observer)
	return () => preferences.removeObserver(observer)
})
