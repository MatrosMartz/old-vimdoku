import { CmdExecutorService, SettingsService } from '~/domain/services'
import type { Settings } from '~/domain/models'

import { LocalStorageDataRepo } from '$infra/browser/repositories'
import { SettingsRepo } from '$infra/repository'

import { vimScreen } from './vim-screen.store'
import { board } from './sudoku.store'
import { storeFromObservable } from './utils'

const settingsStorage = new LocalStorageDataRepo<Settings>({ keyName: 'preferences' })

export const settings = new SettingsService(new SettingsRepo({ storage: settingsStorage }))
export const executor = new CmdExecutorService({ board, settings, vimScreen })

export const settingsStore = storeFromObservable(settings)
