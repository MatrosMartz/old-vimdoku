import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import { hours, minutes, seconds } from '~/tests/utils'

import { formattedTimer, timer } from './timer.store'

let formattedTimerValue = ''

const clearTimer = () => {
	timer.stop()
	timer.reset()
	vi.clearAllTimers()
}

beforeAll(() => {
	vi.useFakeTimers()
	return () => vi.useRealTimers()
})

beforeEach(() => {
	const unsubscribed = formattedTimer.subscribe(ft => (formattedTimerValue = ft))

	return () => {
		clearTimer()
		unsubscribed()
	}
})

describe('Formatted Timer', () => {
	test.concurrent('Should be 00:00:05 after 5 seconds', () => {
		expect(formattedTimerValue).toBe('00:00:00')
		timer.start()

		vi.advanceTimersByTime(seconds(5))
		expect(formattedTimerValue).toBe('00:00:05')
	})
	test.concurrent('Should be 00:00:10 after 10 seconds', () => {
		timer.start()

		vi.advanceTimersByTime(seconds(10))
		expect(formattedTimerValue).toBe('00:00:10')
	})
	test('Should be 00:01:00 after 1 minute', () => {
		timer.start()

		vi.advanceTimersByTime(minutes(1))
		expect(formattedTimerValue).toBe('00:01:00')
	})
	test('Should be 00:03:30 after 3 minutes and 30 seconds', () => {
		timer.start()

		vi.advanceTimersByTime(minutes(3) + seconds(30))
		expect(formattedTimerValue).toBe('00:03:30')
	})
	test('Should be 00:10:00 after 10 minutes', () => {
		timer.start()

		vi.advanceTimersByTime(minutes(10))
		expect(formattedTimerValue).toBe('00:10:00')
	})
	test('Should be 01:00:00 after 1 hour', () => {
		timer.start()

		vi.advanceTimersByTime(hours(1))
		expect(formattedTimerValue).toBe('01:00:00')
	})
	test('Should be 10:00:00 after 10 hours', () => {
		timer.start()

		vi.advanceTimersByTime(hours(10))
		expect(formattedTimerValue).toBe('10:00:00')
	})
})
