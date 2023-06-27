import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import type { IHistoryRepo } from '~/domain/repositories'

import { CmdAutocompleteService, CmdHistoryService } from './history.service'

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
	let cmdHistory: CmdHistoryService
	let cmdAutocomplete: CmdAutocompleteService
	beforeAll(() => {
		vi.useFakeTimers()
		return () => vi.useRealTimers()
	})
	beforeEach(() => {
		cmdHistory = new CmdHistoryService(mockHistoryRepo())
		cmdAutocomplete = new CmdAutocompleteService({ cmdHistory })
	})
	test('The current command should be are ""', () => {
		expect(cmdAutocomplete.getValue()).toBe('')
	})
	test('The command "help :start" should be added at the end', () => {
		cmdAutocomplete.push('help :start')

		expect(cmdHistory.getValue()).toEqual([...defaultCommands, 'help :start'])
	})
	test('The current command after undo Should be "help :set"', () => {
		cmdAutocomplete.undo()

		expect(cmdAutocomplete.getValue()).toBe('help :set')
	})
	test('The current command after undo two Should be "se nu"', () => {
		cmdAutocomplete.undo()
		cmdAutocomplete.undo()

		expect(cmdAutocomplete.getValue()).toBe('quit')
	})
	test('The current command after undo four times Should be "help \'rnu\'"', () => {
		cmdAutocomplete.undo()
		cmdAutocomplete.undo()
		cmdAutocomplete.undo()
		cmdAutocomplete.undo()

		expect(cmdAutocomplete.getValue()).toBe("help 'rnu'")
	})
	test('The current command after redo Should be ""', () => {
		cmdAutocomplete.redo()

		expect(cmdAutocomplete.getValue()).toBe('')
	})
	test('The current command after undo five times and redo two times Should be "pause"', () => {
		cmdAutocomplete.undo()
		cmdAutocomplete.undo()
		cmdAutocomplete.undo()
		cmdAutocomplete.undo()
		cmdAutocomplete.undo()
		cmdAutocomplete.redo()
		cmdAutocomplete.redo()

		expect(cmdAutocomplete.getValue()).toBe('pause')
	})
	test('The current command after add "start easy" undo three times Should be "quit"', () => {
		cmdAutocomplete.push('start easy')
		cmdAutocomplete.undo()
		cmdAutocomplete.undo()
		cmdAutocomplete.undo()

		expect(cmdAutocomplete.getValue()).toBe('quit')
	})
	test('The autocomplete history should contains only the history commands start with help', () => {
		cmdAutocomplete.search('help')
		vi.advanceTimersByTime(500)

		expect(cmdAutocomplete.getCmdAutocomplete()).toEqual([
			'help',
			'help :start',
			"help 'nu'",
			"help 'rnu'",
			'help :set',
		])
	})
	test('The current should be "help :set" undo after timeout', () => {
		cmdAutocomplete.search('help')
		vi.advanceTimersByTime(500)
		cmdAutocomplete.undo()

		expect(cmdAutocomplete.getValue()).toBe('help :set')
	})
	test('should remember what the input was', () => {
		cmdAutocomplete.search('help')
		vi.advanceTimersByTime(500)
		cmdAutocomplete.undo()
		cmdAutocomplete.undo()
		cmdAutocomplete.redo()
		cmdAutocomplete.redo()

		expect(cmdAutocomplete.getValue()).toBe('help')
	})
})
