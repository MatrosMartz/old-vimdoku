import { CmdExecutorService, SettingsService } from '~/domain/services'

import { LocalStorageDataRepo } from '$infra/browser/repositories'
import { SettingsRepo } from '$infra/repository'

import { vimScreen } from './vim-screen.store'
import { board } from './sudoku.store'
import { storeFromObservable } from './utils'

export const settings = new SettingsService(
	new SettingsRepo({ storage: new LocalStorageDataRepo({ keyName: 'preferences' }) })
)
export const executor = new CmdExecutorService({ board, settings, vimScreen })

export const settingsStore = storeFromObservable(settings)
