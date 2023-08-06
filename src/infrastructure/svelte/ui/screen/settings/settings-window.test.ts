import { act, cleanup, render, screen } from '@testing-library/svelte'
import { beforeEach, describe, expect, test } from 'vitest'

import { SetType } from '~/domain/models'
import { vimScreen } from '~/infrastructure/svelte/stores'

import SettingsWindow from './settings-window.svelte'

describe('Settings Window', () => {
	beforeEach(() => {
		render(SettingsWindow)

		return () => {
			vimScreen.removeSecondary()
			cleanup()
		}
	})

	test('should be empty if there is not secondary window', () => {
		expect(document.body).toHaveTextContent('')
	})
	test('should render tabs if there is secondary window', async () => {
		await act(() => {
			vimScreen.setSetsSecondary()
		})

		const tabs = screen.getByTestId('settings-tabs')

		expect(tabs)
	})
	test('should render form if it is an edit type, and select edit tab', async () => {
		await act(() => {
			vimScreen.setSetsSecondary({ setType: SetType.edit })
		})

		const form = screen.getByTestId('settings-form')

		expect(form)

		const editTab = screen.getByTestId<HTMLInputElement>('edit-tab')

		expect(editTab.checked).toBe(true)
	})
	test('should render show if it is an edit type, and select all tab', async () => {
		await act(() => {
			vimScreen.setSetsSecondary({ setType: SetType.all })
		})

		const form = screen.getByTestId('settings-show')

		expect(form)

		const allTab = screen.getByTestId<HTMLInputElement>('all-tab')

		expect(allTab.checked).toBe(true)
	})
	test('should render show di if it is an edit type, and select differ tab', async () => {
		await act(() => {
			vimScreen.setSetsSecondary({ setType: SetType.diff })
		})

		const form = screen.getByTestId('settings-show')

		expect(form)

		const differTab = screen.getByTestId<HTMLInputElement>('differ-tab')

		expect(differTab.checked).toBe(true)
	})
})
