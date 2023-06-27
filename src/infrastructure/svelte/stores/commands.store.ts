import { readable } from 'svelte/store'

import {
	CmdHighlightService,
	CmdSuggestionService,
	CmdHistoryService,
	CmdAutocompleteService,
} from '~/domain/services'
import { DataStorageBrowser } from '$infra/browser/repositories/local-storage.repo'
import { HistoryRepo } from '$infra/repository/history.repo'
import type { Observer } from '~/domain/utils'
import type { SuggestionOption } from '~/domain/models'

export const cmdHighlight = new CmdHighlightService()
export const cmdSuggestions = new CmdSuggestionService()

export const suggestionsStore = readable(cmdSuggestions.getValue(), set => {
	const observer: Observer<SuggestionOption[]> = {
		update: value => set(value),
	}
	cmdSuggestions.addObserver(observer)

	return () => cmdSuggestions.removeObserver(observer)
})

const historyStorage = new DataStorageBrowser<string[]>({ keyName: 'history' })
export const cmdHistory = new CmdHistoryService(new HistoryRepo({ storage: historyStorage }))

export const cmdAutocomplete = new CmdAutocompleteService({ cmdHistory })
