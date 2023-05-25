import { beforeEach, describe, expect, test } from 'vitest'

import { HistoryService } from './history.service'

import type { DataStorageModel } from '../models'

const initialHistoryData: DataStorageModel<string[]> = {
	getActual: () => [
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
	update: () => {},
}

describe('History Service', () => {
	let historyService: HistoryService
	beforeEach(() => {
		historyService = new HistoryService(initialHistoryData)
	})
	test.concurrent('The current command should be are ""', () => {
		expect(historyService.getCurrent()).toBe('')
	})
	test.concurrent('The command "help :start" should be added at the end', () => {
		historyService.push('help :start')

		expect(historyService.getHistory().at(-1)).toBe('help :start')
	})
	test.concurrent('The current command after undo Should be "help :set"', () => {
		historyService.undo()

		expect(historyService.getCurrent()).toBe('help :set')
	})
	test.concurrent('The current command after undo two Should be "se nu"', () => {
		historyService.undo()
		historyService.undo()

		expect(historyService.getCurrent()).toBe('quit')
	})
	test.concurrent('The current command after undo four times Should be "help \'rnu\'"', () => {
		historyService.undo()
		historyService.undo()
		historyService.undo()
		historyService.undo()

		expect(historyService.getCurrent()).toBe("help 'rnu'")
	})
	test.concurrent('The current command after redo Should be ""', () => {
		historyService.redo()

		expect(historyService.getCurrent()).toBe('')
	})
	test.concurrent(
		'The current command after undo five times and redo two times Should be "pause"',
		() => {
			historyService.undo()
			historyService.undo()
			historyService.undo()
			historyService.undo()
			historyService.undo()
			historyService.redo()
			historyService.redo()

			expect(historyService.getCurrent()).toBe('pause')
		}
	)
	test.concurrent(
		'The current command after add "start easy" undo three times Should be "quit"',
		() => {
			historyService.push('start easy')
			historyService.undo()
			historyService.undo()
			historyService.undo()

			expect(historyService.getCurrent()).toBe('quit')
		}
	)
	test.concurrent(
		'The autocomplete history should contains only the history commands start with help',
		() => {
			historyService.setAutocomplete('help')

			expect(historyService.getAutocompleteHistory()).toEqual([
				'help',
				'help :start',
				"help 'nu'",
				"help 'rnu'",
				'help :set',
			])
		}
	)
	test.concurrent('', () => {
		historyService.setAutocomplete('help')
		historyService.undo()
		historyService.undo()

		expect(historyService.getCurrent()).toBe("help 'rnu'")
	})
})
