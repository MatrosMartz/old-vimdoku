import type { TimerSchema, TimerServiceSchema, Updater } from '~/timer/domain/models'

class TimerService implements TimerServiceSchema {
	#interval: number | string | NodeJS.Timeout

	create = () => ({ isPause: true, seconds: 0 })
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
}

export const timerService = new TimerService()
