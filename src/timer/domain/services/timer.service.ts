import type { TimerSchema, TimerService } from '~/timer/domain/models'

const createTimer = (): TimerSchema => ({ isPause: true, seconds: 0 })

export const timerService: TimerService = { createTimer }
