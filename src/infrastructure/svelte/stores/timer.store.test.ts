import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { get } from 'svelte/store'

import { hours, minutes, seconds } from '~/tests/utils'

import { timerStore, formattedTimer } from './timer.store'

const clearTimer = () => {
	timerStore.stop()
	timerStore.reset()
	vi.clearAllTimers()
}

beforeAll(() => {
	vi.useFakeTimers()
})

afterAll(() => {
	vi.useRealTimers()
})

afterEach(() => clearTimer())

describe('Formatted Timer', () => {
	test.concurrent('Should be 00:00:05 after 5 seconds', () => {
		expect(get(formattedTimer)).toBe('00:00:00')
		timerStore.start()

		vi.advanceTimersByTime(seconds(5))
		expect(get(formattedTimer)).toBe('00:00:05')
	})
	test.concurrent('Should be 00:00:10 after 10 seconds', () => {
		timerStore.start()

		vi.advanceTimersByTime(seconds(10))
		expect(get(formattedTimer)).toBe('00:00:10')
	})
	test.concurrent('Should be 00:01:00 after 1 minute', () => {
		timerStore.start()

		vi.advanceTimersByTime(minutes(1))
		expect(get(formattedTimer)).toBe('00:01:00')
	})
	test.concurrent('Should be 00:03:30 after 3 minutes and 30 seconds', () => {
		timerStore.start()

		vi.advanceTimersByTime(minutes(3) + seconds(30))
		expect(get(formattedTimer)).toBe('00:03:30')
	})
	test.concurrent('Should be 00:10:00 after 10 minutes', () => {
		timerStore.start()

		vi.advanceTimersByTime(minutes(10))
		expect(get(formattedTimer)).toBe('00:10:00')
	})
	test.concurrent('Should be 01:00:00 after 1 hour', () => {
		timerStore.start()

		vi.advanceTimersByTime(hours(1))
		expect(get(formattedTimer)).toBe('01:00:00')
	})
	test.concurrent('Should be 10:00:00 after 10 hours', () => {
		timerStore.start()

		vi.advanceTimersByTime(hours(10))
		expect(get(formattedTimer)).toBe('10:00:00')
	})
})
