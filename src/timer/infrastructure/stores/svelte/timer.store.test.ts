/**
 * @vitest-environment node
 */

import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { get } from 'svelte/store'

import type { TimerSchema } from '~/timer/domain/models'
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

afterEach(() => clearTimer())

describe('Timer Store', () => {
	test.concurrent(
		'At startup the timer, seconds should be zero, and isPause should be true',
		() => {
			expect(get(timerStore)).toEqual<TimerSchema>({ isPause: true, seconds: 0 })
		}
	)
	test.concurrent('The seconds should be 10 after start timer', () => {
		timerStore.start()

		vi.advanceTimersByTime(seconds(10))
		expect(get(timerStore)).toEqual<TimerSchema>({ isPause: false, seconds: 10 })
	})
	test.concurrent('The seconds should not advance after pause timer', () => {
		timerStore.start()

		vi.advanceTimersByTime(seconds(5))
		timerStore.stop()
		vi.advanceTimersByTime(seconds(5))
		expect(get(timerStore)).toEqual<TimerSchema>({ isPause: true, seconds: 5 })
	})
})

describe('Formatted Timer', () => {
	test.concurrent('Should be 00:05 after 5 seconds', () => {
		expect(get(formattedTimer)).toBe('00:00')
		timerStore.start()

		vi.advanceTimersByTime(seconds(5))
		expect(get(formattedTimer)).toBe('00:05')

		clearTimer()
	})
	test.concurrent('Should be 00:10 after 10 seconds', () => {
		timerStore.start()

		vi.advanceTimersByTime(seconds(10))
		expect(get(formattedTimer)).toBe('00:10')

		clearTimer()
	})
	test.concurrent('Should be 01:00 after 1 minute', () => {
		timerStore.start()

		vi.advanceTimersByTime(minutes(1))
		expect(get(formattedTimer)).toBe('01:00')

		clearTimer()
	})
	test.concurrent('Should be 03:30 after 3 minutes and 30 seconds', () => {
		timerStore.start()

		vi.advanceTimersByTime(minutes(3) + seconds(30))
		expect(get(formattedTimer)).toBe('03:30')

		clearTimer()
	})
	test.concurrent('Should be 10:00 after 10 minutes', () => {
		timerStore.start()

		vi.advanceTimersByTime(minutes(10))
		expect(get(formattedTimer)).toBe('10:00')

		clearTimer()
	})
	test.concurrent('Should be 01:00:00 after 1 hour', () => {
		timerStore.start()

		vi.advanceTimersByTime(hours(1))
		expect(get(formattedTimer)).toBe('01:00:00')

		clearTimer()
	})
	test.concurrent('Should be 10:00:00 after 10 hours', () => {
		timerStore.start()

		vi.advanceTimersByTime(hours(10))
		expect(get(formattedTimer)).toBe('10:00:00')

		clearTimer()
	})
})
