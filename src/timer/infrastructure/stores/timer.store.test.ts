/**
 * @vitest-environment node
 */

import { get } from 'svelte/store'

import type { TimerSchema } from '~/timer/domain/models'
import { timerStore, formattedTimer } from './timer.store'

afterEach(() => timerStore.reset())

const hours = (t: number) => t * 3600_000
const minutes = (t: number) => t * 60_000
const seconds = (t: number) => t * 1_000

describe('Timer Store', () => {
	test.concurrent(
		'At startup the timer, seconds should be zero, and isPause should be true',
		() => {
			expect(get(timerStore)).toEqual<TimerSchema>({ isPause: true, seconds: 0 })
		}
	)
	test.concurrent('The seconds should be 10 after restart timer', () => {
		vi.useFakeTimers()
		const destroyTimer = timerStore.restart()

		vi.advanceTimersByTime(seconds(10))
		expect(get(timerStore)).toEqual<TimerSchema>({ isPause: false, seconds: 10 })

		destroyTimer()
	})
	test.concurrent('The seconds should be 5 after restart and pause timer', () => {
		vi.useFakeTimers()

		const destroyTimer = timerStore.restart()

		vi.advanceTimersByTime(seconds(5))
		timerStore.pause()
		vi.advanceTimersByTime(seconds(5))

		expect(get(timerStore)).toEqual<TimerSchema>({ isPause: true, seconds: 5 })

		destroyTimer()
	})
})

describe('Formatted Timer', () => {
	test('Should be 00:05 after 5 seconds', () => {
		vi.useFakeTimers()

		expect(get(formattedTimer)).toBe('00:00')

		const destroyTimer = timerStore.restart()

		vi.advanceTimersByTime(seconds(5))
		expect(get(formattedTimer)).toBe('00:05')

		destroyTimer()
	})
	test('Should be 00:10 after 10 seconds', () => {
		vi.useFakeTimers()

		const destroyTimer = timerStore.restart()

		vi.advanceTimersByTime(seconds(10))
		expect(get(formattedTimer)).toBe('00:10')

		destroyTimer()
	})
	test('Should be 01:00 after 1 minute', () => {
		vi.useFakeTimers()

		const destroyTimer = timerStore.restart()

		vi.advanceTimersByTime(minutes(1))
		expect(get(formattedTimer)).toBe('01:00')

		destroyTimer()
	})
	test('Should be 03:30 after 3 minutes and 30 seconds', () => {
		vi.useFakeTimers()

		const destroyTimer = timerStore.restart()

		vi.advanceTimersByTime(minutes(3) + seconds(30))
		expect(get(formattedTimer)).toBe('03:30')

		destroyTimer()
	})
	test('Should be 10:00 after 10 minutes', () => {
		vi.useFakeTimers()

		const destroyTimer = timerStore.restart()

		vi.advanceTimersByTime(minutes(10))
		expect(get(formattedTimer)).toBe('10:00')

		destroyTimer()
	})
	test('Should be 01:00:00 after 1 hour', () => {
		vi.useFakeTimers()

		const destroyTimer = timerStore.restart()

		vi.advanceTimersByTime(hours(1))
		expect(get(formattedTimer)).toBe('01:00:00')

		destroyTimer()
	})
	test('Should be 10:00:00 after 10 hours', () => {
		vi.useFakeTimers()

		const destroyTimer = timerStore.restart()

		vi.advanceTimersByTime(hours(10))
		expect(get(formattedTimer)).toBe('10:00:00')

		destroyTimer()
	})
})
