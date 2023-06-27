import { readable } from 'svelte/store'
import type { TimerSchema } from '~/domain/models'

import { TimerService } from '~/domain/services'
import type { Observer } from '~/domain/utils'

export const timer = new TimerService()

export const timerStore = readable(timer.getValue(), set => {
	const observer: Observer<TimerSchema> = {
		update: value => set(value),
	}
	timer.addObserver(observer)

	return () => timer.removeObserver(observer)
})

export const formattedTimer = readable(TimerService.formatter(timer.getValue().seconds), set => {
	const observer: Observer<TimerSchema> = {
		update: ({ seconds }) => set(TimerService.formatter(seconds)),
	}
	timer.addObserver(observer)

	return () => timer.removeObserver(observer)
})
