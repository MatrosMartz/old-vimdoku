export interface TimerSchema {
	isPause: boolean
	seconds: number
}

type DestroyTimer = () => void

export interface TimerServiceSchema {
	create: () => TimerSchema
	increment: (timer: TimerSchema) => TimerSchema
	pause: (timer: TimerSchema) => TimerSchema
	reset: () => TimerSchema
	restart: (callback: () => void) => DestroyTimer
}
