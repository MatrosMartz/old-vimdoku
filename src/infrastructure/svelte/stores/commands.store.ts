import { writable } from 'svelte/store'

import { CmdHighlightService, CmdSuggestionService, CmdHistoryService } from '~/domain/services'
import { DataStorageBrowser } from '$infra/browser/repositories/local-storage.repo'
import { HistoryRepo } from '$infra/repository/history.repo'

export const cmdHighlight = new CmdHighlightService()
export const cmdSuggestions = new CmdSuggestionService()

function createSuggestionsStore() {
	let timeoutID: ReturnType<typeof setTimeout> | null = null
	const { subscribe, set } = writable(cmdSuggestions.getSuggestions())

	const updateSuggestions = (input: string) => {
		if (timeoutID != null) clearTimeout(timeoutID)

		timeoutID = setTimeout(() => {
			cmdSuggestions.updateSuggestions(input)
			set(cmdSuggestions.getSuggestions())
		}, 200)
	}

	return { subscribe, updateSuggestions }
}

export const suggestionsStore = createSuggestionsStore()

const historyStorage = new DataStorageBrowser<string[]>({ keyName: 'history' })
export const cmdHistory = new CmdHistoryService(new HistoryRepo({ storage: historyStorage }))
