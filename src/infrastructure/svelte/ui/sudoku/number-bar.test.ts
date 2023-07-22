import { act, cleanup, render, screen } from '@testing-library/svelte'
import { beforeEach, describe, expect, test } from 'vitest'

import { SettingsService } from '~/domain/services'
import { settings, selection } from '$infra/svelte/stores'

import NumberBar from './number-bar.svelte'

describe('Number Bar component', () => {
	beforeEach(() => {
		render(NumberBar, { props: { direction: 'row' } })
		return () => {
			cleanup()
		}
	})

	test('Number Should be void', async () => {
		await act(() => {
			selection.moveTo({ col: 0, row: 0 })
			settings.updateByKey('numbers', SettingsService.off)
			settings.updateByKey('relativeNumbers', SettingsService.off)
		})

		const firstLiNum = screen.getByTestId('row-0')

		expect(firstLiNum).toHaveTextContent('')
	})
	test('Number Should be relative', async () => {
		await act(() => {
			selection.moveTo({ col: 0, row: 8 })
			settings.updateByKey('numbers', SettingsService.off)
			settings.updateByKey('relativeNumbers', SettingsService.on)
		})

		const firstLiNum = screen.getByTestId('row-0')

		expect(firstLiNum).toHaveTextContent('8')
	})
	test('Number Should be number', async () => {
		await act(() => {
			selection.moveTo({ col: 0, row: 8 })
			settings.updateByKey('numbers', SettingsService.on)
			settings.updateByKey('relativeNumbers', SettingsService.off)
		})

		const firstLiNum = screen.getByTestId('row-0')

		expect(firstLiNum).toHaveTextContent('1')
	})
	test('Number Should be relative selection', async () => {
		await act(() => {
			selection.moveTo({ col: 0, row: 5 })
			settings.updateByKey('numbers', SettingsService.off)
			settings.updateByKey('relativeNumbers', SettingsService.on)
		})

		const firstLiNum = screen.getByTestId('row-5')

		expect(firstLiNum).toHaveTextContent('~')
	})
	test('Number Should be number selection', async () => {
		await act(() => {
			selection.moveTo({ col: 0, row: 6 })
			settings.updateByKey('numbers', SettingsService.on)
			settings.updateByKey('relativeNumbers', SettingsService.on)
		})

		const firstLiNum = screen.getByTestId('row-5')

		expect(firstLiNum).toHaveTextContent('6')
	})
})
