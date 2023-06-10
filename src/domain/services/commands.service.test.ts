import { beforeEach, describe, expect, test } from 'vitest'

import type { DataStorageRepo } from '../repositories'
import { noop } from '../utils'

import { HistoryService } from './commands.service'

const initialHistoryData: DataStorageRepo<string[]> = {
	get: () => [
		'help',
		'help :start',
		'start',
		"help 'nu'",
		'set nu',
		"help 'rnu'",
		'pause',
		'quit',
		'help :set',
	],
	set: noop,
}

describe.concurrent('History Service', () => {
	let history: HistoryService
	beforeEach(() => {
		history = new HistoryService(initialHistoryData)
	})
	test('The current command should be are ""', () => {
		expect(history.getCurrent()).toBe('')
	})
	test('The command "help :start" should be added at the end', () => {
		history.push('help :start')

		expect(history.getHistory().at(-1)).toBe('help :start')
	})
	test('The current command after undo Should be "help :set"', () => {
		history.undo()

		expect(history.getCurrent()).toBe('help :set')
	})
	test('The current command after undo two Should be "se nu"', () => {
		history.undo()
		history.undo()

		expect(history.getCurrent()).toBe('quit')
	})
	test('The current command after undo four times Should be "help \'rnu\'"', () => {
		history.undo()
		history.undo()
		history.undo()
		history.undo()

		expect(history.getCurrent()).toBe("help 'rnu'")
	})
	test('The current command after redo Should be ""', () => {
		history.redo()

		expect(history.getCurrent()).toBe('')
	})
	test('The current command after undo five times and redo two times Should be "pause"', () => {
		history.undo()
		history.undo()
		history.undo()
		history.undo()
		history.undo()
		history.redo()
		history.redo()

		expect(history.getCurrent()).toBe('pause')
	})
	test('The current command after add "start easy" undo three times Should be "quit"', () => {
		history.push('start easy')
		history.undo()
		history.undo()
		history.undo()

		expect(history.getCurrent()).toBe('quit')
	})
	test('The autocomplete history should contains only the history commands start with help', () => {
		history.updateAutocomplete('help')

		expect(history.getAutocompleteHistory()).toEqual([
			'help',
			'help :start',
			"help 'nu'",
			"help 'rnu'",
			'help :set',
		])
	})
	test('', () => {
		history.updateAutocomplete('help')
		history.undo()
		history.undo()

		expect(history.getCurrent()).toBe("help 'rnu'")
	})
})
