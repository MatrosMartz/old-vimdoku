import type { TimerSchema, ITimerService, Updater } from '~/domain/models'

import { formatNumber } from '../utils'

export class TimerService implements ITimerService {
	#interval: number | string | NodeJS.Timeout = 0

	initialTimer = () => ({ isPause: true, seconds: 0 })
	stop = (timer: TimerSchema) => {
		if (this.#interval) clearInterval(this.#interval)
		return { ...timer, isPause: true }
	}
	reset = ({ isPause }: TimerSchema) => ({ isPause, seconds: 0 })
	start = (callback: (updater: Updater) => void) => {
		this.#interval = setInterval(() => {
			callback(({ seconds }) => ({ isPause: false, seconds: seconds + 1 }))
		}, 1000)
	}

	static formatter = (time: number) => {
		const seconds = formatNumber(String(time % 60))
		const minutes = formatNumber(String(Math.trunc((time % 3_600) / 60)))
		const hours = formatNumber(String(Math.trunc(time / 3_600)))

		return `${hours}:${minutes}:${seconds}`
	}
}
