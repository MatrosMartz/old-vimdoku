import { writable } from 'svelte/store'

import { timerService } from '~/timer/domain/services'

function createTimerStore() {
	const { subscribe, update } = writable(timerService.createTimer())

	const pause = () => update(({ seconds }) => ({ isPause: true, seconds }))
	const resume = () => update(({ seconds }) => ({ isPause: false, seconds }))
	const increment = () => update(({ isPause, seconds }) => ({ isPause, seconds: seconds + 1 }))
	const reset = () => update(({ isPause }) => ({ isPause, seconds: 0 }))

	return { subscribe, pause, resume, reset, increment }
}

export const timerStore = createTimerStore()
