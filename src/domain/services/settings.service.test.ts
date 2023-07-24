import { beforeEach, describe, expect, test } from 'vitest'

import { SettingsService } from './settings.service'

import type { ISettingsRepo } from '../repositories'
import { defaultSettings, type Settings } from '../models'

const getPrefDataRepo = (): ISettingsRepo => {
	let preferences = { ...defaultSettings }

	return {
		get: () => Object.freeze(preferences),
		update: updater => {
			preferences = updater(preferences)
		},
	}
}

describe.concurrent('Preferences Service', () => {
	let preferences: SettingsService

	beforeEach(() => {
		preferences = new SettingsService(getPrefDataRepo())
	})

	test('Only numbers preference should change to false', () => {
		preferences.updateByKey('numbers', SettingsService.off)

		expect(preferences.value).toEqual<Settings>({
			...defaultSettings,
			numbers: false,
		})
	})
	test('Only toggle automaticValidation preference should change to true', () => {
		preferences.updateByKey('automaticValidation', SettingsService.on)

		expect(preferences.value).toEqual<Settings>({
			...defaultSettings,
			automaticValidation: !defaultSettings.automaticValidation,
		})
	})
	test('Only toggle timer preference should toggle', () => {
		preferences.updateByKey('timer', SettingsService.toggle)

		expect(preferences.value).toEqual<Settings>({
			...defaultSettings,
			timer: !defaultSettings.timer,
		})
	})
})
