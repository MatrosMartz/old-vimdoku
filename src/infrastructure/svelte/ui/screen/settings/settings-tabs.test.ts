import { beforeEach, describe, expect, test } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/svelte'

import SettingsTabs from './settings-tabs.svelte'
import { vimScreen } from '~/infrastructure/svelte/stores'
import { SetType } from '~/domain/models'

describe('Settings Tabs', () => {
	beforeEach(async () => {
		await act(() => vimScreen.setSetsSecondary())
		render(SettingsTabs)

		return () => {
			cleanup()
		}
	})

	test('should be change SetType to all if clicked', async () => {
		const allTab = screen.getByTestId('all-tab')

		await fireEvent.click(allTab)

		expect(vimScreen.getOptForKey('setType')).toBe(SetType.all)
	})
	test('should be change SetType to differ if clicked', async () => {
		const differTab = screen.getByTestId('differ-tab')

		await fireEvent.click(differTab)

		expect(vimScreen.getOptForKey('setType')).toBe(SetType.diff)
	})
	test('should be change SetType to edit if clicked', async () => {
		await act(() => vimScreen.setSetsSecondary({ setType: SetType.all }))
		const editTab = screen.getByTestId('edit-tab')

		await fireEvent.click(editTab)

		expect(vimScreen.getOptForKey('setType')).toBe(SetType.edit)
	})
})
