import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import type { IHistoryRepo } from '~/domain/repositories'

import { CmdHistoryService } from './history.service'

const defaultCommands = [
	'help',
	'help :start',
	'start',
	"help 'nu'",
	'set nu',
	"help 'rnu'",
	'pause',
	'quit',
	'help :set',
]

const mockHistoryRepo = (): IHistoryRepo => {
	let commands = [...defaultCommands]
	return {
		get: () => Object.freeze(commands),
		update: updater => {
			commands = updater(commands)
		},
	}
}

describe.concurrent('History Service', () => {
	let history: CmdHistoryService
	beforeAll(() => {
		vi.useFakeTimers()
		return () => vi.useRealTimers()
	})
	beforeEach(() => {
		history = new CmdHistoryService(mockHistoryRepo())
	})
	test('The current command should be are ""', () => {
		expect(history.getCurrent()).toBe('')
	})
	test('The command "help :start" should be added at the end', () => {
		history.push('help :start')

		expect(history.getHistory()).toEqual([...defaultCommands, 'help :start'])
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
		vi.advanceTimersByTime(500)

		expect(history.getAutocompleteHistory()).toEqual([
			'help',
			'help :start',
			"help 'nu'",
			"help 'rnu'",
			'help :set',
		])
	})
	test('The current should be "help :set" undo after timeout', () => {
		history.updateAutocomplete('help')
		vi.advanceTimersByTime(500)
		history.undo()

		expect(history.getCurrent()).toBe('help :set')
	})
	test('should remember what the input was', () => {
		history.updateAutocomplete('help')
		vi.advanceTimersByTime(500)
		history.undo()
		history.undo()
		history.redo()
		history.redo()

		expect(history.getCurrent()).toBe('help')
	})
})
