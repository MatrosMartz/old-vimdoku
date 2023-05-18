import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import { seconds } from '~/tests/utils'

import type { TimerSchema } from '../models'
import { timerService } from './timer.service'
import { TimerMock } from '~/timer/infrastructure/stores/mock'

const timer = new TimerMock(timerService)

beforeAll(() => {
	vi.useFakeTimers()
})
afterEach(() => {
	timer.stop()
	timer.reset()
})

describe('Time Service', () => {
	test.concurrent('At startup the timer, seconds should be zero, and if isPause true', () => {
		expect(timer.getTimer()).toEqual<TimerSchema>({ isPause: true, seconds: 0 })
	})
	test.concurrent('The seconds should be 10 after start timer', () => {
		timer.start()
		vi.advanceTimersByTime(seconds(10))
		expect(timer.getTimer()).toEqual<TimerSchema>({ isPause: false, seconds: 10 })
	})
	test.concurrent('The seconds should not advance after pause timer', () => {
		timer.start()
		vi.advanceTimersByTime(seconds(5))
		expect(timer.getTimer()).toEqual<TimerSchema>({ isPause: false, seconds: 5 })

		timer.stop()
		vi.advanceTimersByTime(seconds(5))
		expect(timer.getTimer()).toEqual<TimerSchema>({ isPause: true, seconds: 5 })
	})
	test.concurrent('The seconds should be 5 after reset timer', () => {
		timer.start()
		vi.advanceTimersByTime(seconds(10))
		expect(timer.getTimer()).toEqual<TimerSchema>({ isPause: false, seconds: 10 })

		timer.reset()
		vi.advanceTimersByTime(seconds(5))
		expect(timer.getTimer()).toEqual<TimerSchema>({ isPause: false, seconds: 5 })
	})
})
