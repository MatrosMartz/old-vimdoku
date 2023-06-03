import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/svelte'

import { hours, minutes, seconds } from '~/tests/utils'
import { timerStore } from '../stores'

import Timer from './timer.svelte'

describe('Timer Component', () => {
	let timer: HTMLElement

	beforeAll(() => {
		vi.useFakeTimers()
		return () => {
			vi.useRealTimers()
		}
	})
	beforeEach(() => {
		render(Timer)
		timerStore.start()
		timer = screen.getByTestId('timer')
		return () => {
			cleanup()
			timerStore.stop()
			timerStore.reset()
			vi.clearAllTimers()
		}
	})

	test('Should start with zero', () => {
		expect(timer).toHaveTextContent('00:00:00')
	})
	test('Should display the formatted time value after 5 seconds', async () => {
		await vi.advanceTimersByTimeAsync(seconds(5))
		expect(timer).toHaveTextContent('00:00:05')
	})
	test('Should display the formatted time value after 10 minutes', async () => {
		await vi.advanceTimersByTimeAsync(minutes(10))
		expect(timer).toHaveTextContent('00:10:00')
	})
	test('Should display the formatted time value after 1 hour', async () => {
		await vi.advanceTimersByTimeAsync(hours(1))
		expect(timer).toHaveTextContent('01:00:00')
	})
})
