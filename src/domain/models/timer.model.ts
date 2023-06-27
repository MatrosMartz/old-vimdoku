import type { Observable } from '../utils'

export interface TimerSchema {
	isPause: boolean
	seconds: number
}

export interface ITimerService extends Observable<TimerSchema> {
	stop: () => void
	reset: () => void
	start: () => void
}
