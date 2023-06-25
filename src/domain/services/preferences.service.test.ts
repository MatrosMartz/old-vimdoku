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
		preferences.updateByKey('numbers', PreferencesService.off)

		expect(preferences.getValue()).toEqual<Preferences>({
			...defaultPreferences,
			numbers: false,
		})
	})
	test('Only toggle automaticValidation preference should change to true', () => {
		preferences.updateByKey('automaticValidation', PreferencesService.on)

		expect(preferences.getValue()).toEqual<Preferences>({
			...defaultPreferences,
			automaticValidation: !defaultPreferences.automaticValidation,
		})
	})
	test('Only toggle timer preference should toggle', () => {
		preferences.updateByKey('timer', PreferencesService.toggle)

		expect(preferences.getValue()).toEqual<Preferences>({
			...defaultPreferences,
			timer: !defaultPreferences.timer,
		})
	})
})
