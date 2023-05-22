import type { TimerSchema, TimerModel, Updater } from '~/domain/models'

const format = (n: string) => (n.length > 1 ? n : '0' + n)

export class TimerService implements TimerModel {
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
		const seconds = format(String(time % 60))
		const minutes = format(String(Math.trunc((time % 3_600) / 60)))
		const hours = format(String(Math.trunc(time / 3_600)))

		return `${hours}:${minutes}:${seconds}`
	}
}
