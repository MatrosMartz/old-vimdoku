export interface TimerSchema {
	isPause: boolean
	seconds: number
}

export interface TimerService {
	createTimer: () => TimerSchema
}
