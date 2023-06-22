import { act, cleanup, render, screen } from '@testing-library/svelte'
import { beforeEach, describe, expect, test } from 'vitest'

import { PreferencesService } from '~/domain/services'
import { preferencesStore, selectionStore } from '../stores'

import NumberBar from './number-bar.svelte'

describe('Number Bar component', () => {
	beforeEach(() => {
		render(NumberBar, { props: { direction: 'vertical' } })
		return () => {
			cleanup()
		}
	})

	test('Number Should be void', async () => {
		await act(() => {
			selectionStore.moveTo({ col: 0, row: 0 })
			preferencesStore.updatePreference('numbers', PreferencesService.off)
			preferencesStore.updatePreference('relativeNumbers', PreferencesService.off)
		})

		const firstLiNum = screen.getByTestId('vertical-0')

		expect(firstLiNum).toHaveTextContent('')
	})
	test('Number Should be relative', async () => {
		await act(() => {
			selectionStore.moveTo({ col: 8, row: 0 })
			preferencesStore.updatePreference('numbers', PreferencesService.off)
			preferencesStore.updatePreference('relativeNumbers', PreferencesService.on)
		})

		const firstLiNum = screen.getByTestId('vertical-0')

		expect(firstLiNum).toHaveTextContent('8')
	})
	test('Number Should be number', async () => {
		await act(() => {
			selectionStore.moveTo({ col: 8, row: 0 })
			preferencesStore.updatePreference('numbers', PreferencesService.on)
			preferencesStore.updatePreference('relativeNumbers', PreferencesService.off)
		})

		const firstLiNum = screen.getByTestId('vertical-0')

		expect(firstLiNum).toHaveTextContent('1')
	})
	test('Number Should be relative selection', async () => {
		await act(() => {
			selectionStore.moveTo({ col: 5, row: 0 })
			preferencesStore.updatePreference('numbers', PreferencesService.off)
			preferencesStore.updatePreference('relativeNumbers', PreferencesService.on)
		})

		const firstLiNum = screen.getByTestId('vertical-5')

		expect(firstLiNum).toHaveTextContent('~')
	})
	test('Number Should be number selection', async () => {
		await act(() => {
			selectionStore.moveTo({ col: 5, row: 0 })
			preferencesStore.updatePreference('numbers', PreferencesService.on)
			preferencesStore.updatePreference('relativeNumbers', PreferencesService.on)
		})

		const firstLiNum = screen.getByTestId('vertical-5')

		expect(firstLiNum).toHaveTextContent('6')
	})
})
