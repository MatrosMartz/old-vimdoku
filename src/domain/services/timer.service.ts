import type { TimerSchema, ITimerService } from '~/domain/models'

import { formatNumber, type Observer } from '../utils'

export class TimerService implements ITimerService {
	#interval: number | string | NodeJS.Timeout = 0
	#value: TimerSchema = { isPause: true, seconds: 0 }
	#observers: Observer<TimerSchema>[] = []

	#notifyObservers() {
		this.#observers.forEach(obs => {
			obs.update({ ...this.#value })
		})
	}
	addObserver(observer: Observer<TimerSchema>) {
		this.#observers = [...this.#observers, observer]
	}
	removeObserver(observer: Observer<TimerSchema>) {
		this.#observers = this.#observers.filter(obs => obs !== observer)
	}
	get value() {
		return Object.freeze(this.#value)
	}

	stop = () => {
		if (this.#interval) clearInterval(this.#interval)
		this.#value = { ...this.#value, isPause: true }
		this.#notifyObservers()
	}
	reset() {
		this.#value = { ...this.#value, seconds: 0 }
		this.#notifyObservers()
	}
	start() {
		this.#value = { ...this.#value, isPause: false }
		this.#interval = setInterval(() => {
			this.#value = { ...this.#value, seconds: this.#value.seconds + 1 }
			this.#notifyObservers()
		}, 1000)
	}

	static formatter = (time: number) => {
		const seconds = formatNumber(String(time % 60))
		const minutes = formatNumber(String(Math.trunc((time % 3_600) / 60)))
		const hours = formatNumber(String(Math.trunc(time / 3_600)))

		return `${hours}:${minutes}:${seconds}`
	}
}
