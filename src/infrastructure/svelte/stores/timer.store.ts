import { derived, writable } from 'svelte/store'

import { TimerService } from '~/domain/services'

export const timer = new TimerService()

function createTimerStore() {
	const { subscribe, update } = writable(timer.initialTimer())

	const stop = () => update(timer.stop)
	const reset = () => update(timer.reset)
	const start = () => timer.start(update)

	return { subscribe, stop, reset, start }
}

export const timerStore = createTimerStore()

export const formattedTimer = derived(timerStore, ({ seconds }) => TimerService.formatter(seconds))
