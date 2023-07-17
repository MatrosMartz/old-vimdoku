import {
	CmdHighlightService,
	CmdSuggestionService,
	CmdHistoryService,
	CmdAutocompleteService,
} from '~/domain/services'
import { LocalStorageDataRepo } from '$infra/browser/repositories'
import { HistoryRepo } from '$infra/repository'

import { storeFromObservable } from './utils'

const historyStorage = new LocalStorageDataRepo<string[]>({ keyName: 'history' })

export const cmdHistory = new CmdHistoryService(new HistoryRepo({ storage: historyStorage }))
export const cmdAutocomplete = new CmdAutocompleteService({ cmdHistory })
export const cmdHighlight = new CmdHighlightService()
export const cmdSuggestions = new CmdSuggestionService()

export const suggestionsStore = storeFromObservable(cmdSuggestions)
