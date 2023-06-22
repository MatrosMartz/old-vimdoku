import { beforeEach, describe, expect, test } from 'vitest'

import { PreferencesService } from './preferences.service'

import type { IPreferencesRepo } from '../repositories'
import { defaultPreferences, type Preferences } from '../models'

const getPrefDataRepo = (): IPreferencesRepo => {
	let preferences = { ...defaultPreferences }

	return {
		get: () => Object.freeze(preferences),
		update: updater => {
			preferences = updater(preferences)
		},
	}
}

describe.concurrent('Preferences Service', () => {
	let preferences: PreferencesService

	beforeEach(() => {
		preferences = new PreferencesService(getPrefDataRepo())
	})

	test('Only numbers preference should change to false', () => {
		preferences.updatePreference('numbers', PreferencesService.off)

		expect(preferences.getPreferences()).toEqual<Preferences>({
			...defaultPreferences,
			numbers: false,
		})
	})
	test('Only toggle automaticValidation preference should change to true', () => {
		preferences.updatePreference('automaticValidation', PreferencesService.on)

		expect(preferences.getPreferences()).toEqual<Preferences>({
			...defaultPreferences,
			automaticValidation: !defaultPreferences.automaticValidation,
		})
	})
	test('Only toggle timer preference should toggle', () => {
		preferences.updatePreference('timer', PreferencesService.toggle)

		expect(preferences.getPreferences()).toEqual<Preferences>({
			...defaultPreferences,
			timer: !defaultPreferences.timer,
		})
	})
})
