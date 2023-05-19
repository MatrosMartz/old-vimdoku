import { derived, writable } from 'svelte/store'

import { timerService } from '~/domain/services'

function createTimerStore() {
	const { subscribe, update } = writable(timerService.create())

	const stop = () => update(timerService.stop)
	const reset = () => update(timerService.reset)
	const start = () => timerService.start(update)

	return { subscribe, stop, reset, start }
}

export const timerStore = createTimerStore()

export const formattedTimer = derived(timerStore, ({ seconds }) => timerService.formatter(seconds))
