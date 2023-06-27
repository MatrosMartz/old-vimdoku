import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import { seconds } from '~/tests/utils'

import type { TimerSchema } from '../models'
import { TimerService } from './timer.service'

describe('Time Service', () => {
	let timer: TimerService

	beforeAll(() => {
		vi.useFakeTimers()
	})
	beforeEach(() => {
		timer = new TimerService()
	})
	afterEach(() => {
		timer.stop()
		timer.reset()
	})
	afterAll(() => {
		vi.useRealTimers
	})

	test.concurrent('At startup the timer, seconds should be zero, and if isPause true', () => {
		expect(timer.getValue()).toEqual<TimerSchema>({ isPause: true, seconds: 0 })
	})
	test.concurrent('The seconds should be 10 after start timer', () => {
		timer.start()
		vi.advanceTimersByTime(seconds(10))
		expect(timer.getValue()).toEqual<TimerSchema>({ isPause: false, seconds: 10 })
	})
	test.concurrent('The seconds should not advance after pause timer', () => {
		timer.start()
		vi.advanceTimersByTime(seconds(5))
		expect(timer.getValue()).toEqual<TimerSchema>({ isPause: false, seconds: 5 })

		timer.stop()
		vi.advanceTimersByTime(seconds(5))
		expect(timer.getValue()).toEqual<TimerSchema>({ isPause: true, seconds: 5 })
	})
	test.concurrent('The seconds should be 5 after reset timer', () => {
		timer.start()
		vi.advanceTimersByTime(seconds(10))
		expect(timer.getValue()).toEqual<TimerSchema>({ isPause: false, seconds: 10 })

		timer.reset()
		vi.advanceTimersByTime(seconds(5))
		expect(timer.getValue()).toEqual<TimerSchema>({ isPause: false, seconds: 5 })
	})
})

describe('Timer Service Format', () => {
	test.concurrent('If the seconds are 5 it should be 00:00:05', () => {
		expect(TimerService.formatter(5)).toBe('00:00:05')
	})
	test.concurrent('If the seconds are 10 it should be 00:00:10', () => {
		expect(TimerService.formatter(10)).toBe('00:00:10')
	})
	test.concurrent('If the minutes are 1 it should be 00:01:00', () => {
		expect(TimerService.formatter(60)).toBe('00:01:00')
	})
	test.concurrent('If the minutes are 10 and seconds 30 it should be 00:10:30', () => {
		expect(TimerService.formatter(630)).toBe('00:10:30')
	})
	test.concurrent('If the hours are 1 it should be 01:00:00', () => {
		expect(TimerService.formatter(3_600)).toBe('01:00:00')
	})
})
