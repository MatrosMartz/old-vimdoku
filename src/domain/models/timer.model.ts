import type { Observable } from '../utils'

export interface TimerSchema {
	isPause: boolean
	seconds: number
}

export interface ITimerService extends Observable<TimerSchema> {
	reset(): void
	start(): void
	stop(): void
}
