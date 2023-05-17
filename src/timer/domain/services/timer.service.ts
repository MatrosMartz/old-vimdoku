import type { TimerSchema, TimerServiceSchema } from '~/timer/domain/models'

class TimerService implements TimerServiceSchema {
	#interval: number | string | NodeJS.Timeout
	#initialTimer: TimerSchema = { isPause: true, seconds: 0 }

	create = () => ({ ...this.#initialTimer })
	increment = ({ seconds }: TimerSchema) => ({ isPause: false, seconds: seconds + 1 })
	pause = (timer: TimerSchema) => {
		if (this.#interval) clearInterval(this.#interval)
		return { ...timer, isPause: true }
	}
	reset = () => {
		if (this.#interval) clearInterval(this.#interval)
		return { ...this.#initialTimer }
	}
	restart = (callback: () => void) => {
		this.#interval = setInterval(callback, 1000)
		return () => clearInterval(this.#interval)
	}
}

export const timerService = new TimerService()
