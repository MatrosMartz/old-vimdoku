import { cleanup, render, screen } from '@testing-library/svelte'
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import { hours, minutes, seconds } from '~/tests/utils'
import { timer } from '$infra/svelte/stores'

import Timer from './timer.svelte'

describe('Timer Component', () => {
	let timerEl: HTMLElement

	beforeAll(() => {
		vi.useFakeTimers()
		return () => {
			vi.useRealTimers()
		}
	})
	beforeEach(() => {
		render(Timer)
		timer.start()
		timerEl = screen.getByTestId('timer')
		return () => {
			cleanup()
			timer.stop()
			timer.reset()
			vi.clearAllTimers()
		}
	})

	test('Should start with zero', () => {
		expect(timerEl).toHaveTextContent('00:00:00')
	})
	test('Should display the formatted time value after 5 seconds', async () => {
		await vi.advanceTimersByTimeAsync(seconds(5))
		expect(timerEl).toHaveTextContent('00:00:05')
	})
	test('Should display the formatted time value after 10 minutes', async () => {
		await vi.advanceTimersByTimeAsync(minutes(10))
		expect(timerEl).toHaveTextContent('00:10:00')
	})
	test('Should display the formatted time value after 1 hour', async () => {
		await vi.advanceTimersByTimeAsync(hours(1))
		expect(timerEl).toHaveTextContent('01:00:00')
	})
})
