import { derived, writable } from 'svelte/store'

import { timerService } from '~/timer/domain/services'

function createTimerStore() {
	const { subscribe, update } = writable(timerService.create())

	const stop = () => update(timerService.stop)
	const reset = () => update(timerService.reset)
	const start = () => timerService.start(update)

	return { subscribe, stop, reset, start }
}

export const timerStore = createTimerStore()

const format = (str: string) => (str.length < 2 ? '0' + str : str)

export const formattedTimer = derived(timerStore, ({ seconds: time }) => {
	const seconds = String(time % 60)
	const minutes = String(Math.trunc(time / 60) % 60)
	const hours = String(Math.trunc(time / 3600))
	return `${time >= 3600 ? format(hours) + ':' : ''}${format(minutes)}:${format(seconds)}`
})
