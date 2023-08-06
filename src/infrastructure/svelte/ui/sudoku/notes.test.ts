import { act, cleanup, render, screen } from '@testing-library/svelte'
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import { Solution } from '~/domain/entities'
import { board, selection } from '$infra/svelte/stores'

import Notes from './notes.svelte'

const solution = new Solution()

describe('Notes Component', () => {
	beforeAll(() => {
		vi.useFakeTimers()
		return () => vi.useRealTimers()
	})
	beforeEach(() => {
		render(Notes)
		board.initBoard({ solution })
		vi.advanceTimersByTime(0)
		const boxPos = board.getEmptyBoxesPos()[0]
		selection.moveTo(boxPos)

		return () => {
			cleanup()
		}
	})

	test('should render empty dom', () => {
		const notes = screen.getByTestId('notes')

		expect(notes).toHaveTextContent('')
	})
	test('should render "1" note', async () => {
		const note = screen.getByTestId('notes')

		await act(() => {
			board.toggleNote(1)
		})

		expect(note).toHaveTextContent(/^1$/)
	})
	test('should render "1", "2" and "3" notes', async () => {
		const note = screen.getByTestId('notes')

		await act(() => {
			board.toggleNote(1)
			board.toggleNote(2)
			board.toggleNote(3)
		})

		expect(note).toHaveTextContent(/^123$/)
	})
	test('should render all notes', async () => {
		const note = screen.getByTestId('notes')

		await act(() => {
			board.toggleNote(1)
			board.toggleNote(2)
			board.toggleNote(3)
			board.toggleNote(4)
			board.toggleNote(5)
			board.toggleNote(6)
			board.toggleNote(7)
			board.toggleNote(8)
			board.toggleNote(9)
		})

		expect(note).toHaveTextContent(/^123456789$/)
	})
	test('should only render "2" note after toggle two times "1" note', async () => {
		const note = screen.getByTestId('notes')

		await act(() => {
			board.toggleNote(1)
			board.toggleNote(2)
			board.toggleNote(1)
		})

		expect(note).toHaveTextContent(/^2$/)
	})
	test('should render empty dom after toggle "0"', async () => {
		const notes = screen.getByTestId('notes')

		await act(() => {
			board.toggleNote(1)
			board.toggleNote(2)
			board.toggleNote(3)
			board.toggleNote(0)
		})
		expect(notes).toHaveTextContent('')
	})
})
