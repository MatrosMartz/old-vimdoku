import { derived, writable } from 'svelte/store'

import { TimerService } from '~/domain/services'

function createTimerStore() {
	const timerService = new TimerService()
	const { subscribe, update } = writable(timerService.initialTimer())

	const stop = () => update(timerService.stop)
	const reset = () => update(timerService.reset)
	const start = () => timerService.start(update)

	return { subscribe, stop, reset, start }
}

export const timerStore = createTimerStore()

export const formattedTimer = derived(timerStore, ({ seconds }) => TimerService.formatter(seconds))
