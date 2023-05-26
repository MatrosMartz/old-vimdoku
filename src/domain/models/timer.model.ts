export interface TimerSchema {
	isPause: boolean
	seconds: number
}

export type Updater = (timer: TimerSchema) => TimerSchema

export interface ITimerService {
	initialTimer: () => TimerSchema
	stop: (timer: TimerSchema) => TimerSchema
	reset: (timer: TimerSchema) => TimerSchema
	start: (callback: (updater: Updater) => void) => void
}
