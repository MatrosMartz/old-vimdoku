import { readable } from 'svelte/store'

import { CmdExecutorService, SettingsService } from '~/domain/services'
import type { Settings } from '~/domain/models'
import type { Observer } from '~/domain/utils'

import { DataStorageBrowser } from '$infra/browser/repositories/local-storage.repo'
import { SettingsRepo } from '$infra/repository/settings.repo'

import { vimScreen } from './vim-screen.store'

const settingsStorage = new DataStorageBrowser<Settings>({ keyName: 'preferences' })
export const settings = new SettingsService(new SettingsRepo({ storage: settingsStorage }))

export const executor = new CmdExecutorService({ preferences: settings, vimScreen })

export const settingsStore = readable(settings.getValue(), set => {
	const observer: Observer<Settings> = { update: value => set(value) }

	settings.addObserver(observer)
	return () => settings.removeObserver(observer)
})
