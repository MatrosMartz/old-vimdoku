import { describe, expect, test } from 'vitest'

import { BoardErrors } from '~/domain/utils'

import { Notes } from './notes.entity'

describe.concurrent('Notes Entity', () => {
	test('should be initialized Notes with only 1,2 and 6 notes', () => {
		const notes = new Notes([1, 2, 6])

		expect(notes.value).toEqual([1, 2, null, null, null, 6, null, null, null])
	})

	test.each([-1, -10, 10, 19])('should be throw', value => {
		const notes = new Notes()
		const assertError = new BoardErrors.InvalidValue({ type: 'note', value })

		expect(() => notes.toggleNote(value)).toThrow(assertError)
	})
})
