import type { TimerSchema, TimerServiceSchema } from '~/domain/models'

export class TimerMock {
	#timer: TimerSchema
	#timerService: TimerServiceSchema
	constructor(timerService: TimerServiceSchema) {
		this.#timerService = timerService
		this.#timer = this.#timerService.create()
	}

	#update = (callback: (timer: TimerSchema) => TimerSchema) => {
		this.#timer = callback(this.#timer)
	}

	stop = () => {
		this.#timer = this.#timerService.stop(this.#timer)
	}
	reset = () => {
		this.#timer = this.#timerService.reset(this.#timer)
	}
	start = () => this.#timerService.start(this.#update)

	getTimer = () => this.#timer
}
