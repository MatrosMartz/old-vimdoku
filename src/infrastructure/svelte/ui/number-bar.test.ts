import { act, cleanup, render, screen } from '@testing-library/svelte'
import { beforeEach, describe, expect, test } from 'vitest'

import { PreferencesService } from '~/domain/services'
import { preferences, selection } from '../stores'

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
			preferences.updateByKey('numbers', PreferencesService.off)
			preferences.updateByKey('relativeNumbers', PreferencesService.off)
		})

		const firstLiNum = screen.getByTestId('row-0')

		expect(firstLiNum).toHaveTextContent('')
	})
	test('Number Should be relative', async () => {
		await act(() => {
			selection.moveTo({ col: 0, row: 8 })
			preferences.updateByKey('numbers', PreferencesService.off)
			preferences.updateByKey('relativeNumbers', PreferencesService.on)
		})

		const firstLiNum = screen.getByTestId('row-0')

		expect(firstLiNum).toHaveTextContent('8')
	})
	test('Number Should be number', async () => {
		await act(() => {
			selection.moveTo({ col: 0, row: 8 })
			preferences.updateByKey('numbers', PreferencesService.on)
			preferences.updateByKey('relativeNumbers', PreferencesService.off)
		})

		const firstLiNum = screen.getByTestId('row-0')

		expect(firstLiNum).toHaveTextContent('1')
	})
	test('Number Should be relative selection', async () => {
		await act(() => {
			selection.moveTo({ col: 0, row: 5 })
			preferences.updateByKey('numbers', PreferencesService.off)
			preferences.updateByKey('relativeNumbers', PreferencesService.on)
		})

		const firstLiNum = screen.getByTestId('row-5')

		expect(firstLiNum).toHaveTextContent('~')
	})
	test('Number Should be number selection', async () => {
		await act(() => {
			selection.moveTo({ col: 0, row: 5 })
			preferences.updateByKey('numbers', PreferencesService.on)
			preferences.updateByKey('relativeNumbers', PreferencesService.on)
		})

		const firstLiNum = screen.getByTestId('row-5')

		expect(firstLiNum).toHaveTextContent('6')
	})
})
