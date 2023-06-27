import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/svelte'

import { BoxKinds } from '~/domain/models'
import { getBoxAndPosByKind } from '~/tests/utils'
import { boardStore, modes } from '../stores'

import Box from './box.svelte'

afterEach(() => cleanup())

describe('Box Component in Insert Mode', () => {
	beforeAll(() => {
		modes.setInsert()
		return () => modes.setNormal()
	})

	describe('Box Component Empty', () => {
		test('should be selectable', async () => {
			render(Box, { props: { row: 1, col: 1 } })
			const button = screen.getByTestId('1-1')

			expect(button).not.toHaveClass('selected')

			await fireEvent.click(button)

			expect(button).toHaveClass('selected')
		})
		test('should not visible notes', async () => {
			render(Box, { props: { row: 0, col: 0 } })
			const notes = screen.getByTestId('notes')

			expect(notes).not.toBeVisible()
		})
	})
	describe('Box Component Empty', () => {
		test('should write three', async () => {
			const { pos } = getBoxAndPosByKind(boardStore, BoxKinds.Empty)!

			expect(pos).not.toBeUndefined()

			render(Box, { props: pos })
			const button = screen.getByTestId(`${pos.row}-${pos.col}`)
			const value = screen.getByTestId('value')

			expect(value).toHaveTextContent('')

			await fireEvent.click(button)
			await fireEvent.keyDown(button, { key: '3' })

			expect(value).toHaveTextContent('3')
		})
		test('should deselected after write', async () => {
			const { pos } = getBoxAndPosByKind(boardStore, BoxKinds.Empty)!

			expect(pos).not.toBeUndefined()

			render(Box, { props: pos })
			const button = screen.getByTestId(`${pos.row}-${pos.col}`)

			await fireEvent.click(button)
			await fireEvent.keyDown(button, { key: '3' })

			expect(button).not.toHaveClass('selected')
		})
		test('should delete number with press zero', async () => {
			const { pos } = getBoxAndPosByKind(boardStore, BoxKinds.Empty)!

			expect(pos).not.toBeUndefined()

			render(Box, { props: pos })
			const button = screen.getByTestId(`${pos.row}-${pos.col}`)

			const value = screen.getByTestId('value')

			await fireEvent.click(button)
			await fireEvent.keyDown(button, { key: '3' })

			expect(value).toHaveTextContent('3')

			await fireEvent.click(button)
			await fireEvent.keyDown(button, { key: '0' })

			expect(value).toHaveTextContent('')
		})
		test('should delete number with press Backspace', async () => {
			const { pos } = getBoxAndPosByKind(boardStore, BoxKinds.Empty)!

			expect(pos).not.toBeUndefined()

			render(Box, { props: pos })
			const button = screen.getByTestId(`${pos.row}-${pos.col}`)
			const value = screen.getByTestId('value')

			await fireEvent.click(button)
			await fireEvent.keyDown(button, { key: '3' })

			expect(value).toHaveTextContent('3')

			await fireEvent.click(button)
			await fireEvent.keyDown(button, { code: 'BackSpace' })

			expect(value).toHaveTextContent('')
		})
	})
	describe('Box Component Initial', () => {
		test('should have initial class', async () => {
			const { pos } = getBoxAndPosByKind(boardStore, BoxKinds.Initial)!

			expect(pos).not.toBeUndefined()

			render(Box, { props: pos })
			const button = screen.getByTestId(`${pos.row}-${pos.col}`)

			expect(button).toHaveClass('initial')
		})
		test('should not write', async () => {
			const { pos, box } = getBoxAndPosByKind(boardStore, BoxKinds.Initial)!

			expect(pos).not.toBeUndefined()
			expect(box.value).not.toBe(0)

			render(Box, { props: pos })
			const button = screen.getByTestId(`${pos.row}-${pos.col}`)

			expect(button).toHaveTextContent(String(box.value))

			await fireEvent.click(button)
			await fireEvent.keyDown(button, { key: '3' })

			expect(button).toHaveClass('selected')
		})
	})
})

describe('Box Component in Annotation Mode', () => {
	beforeAll(() => {
		modes.setAnnotation()
		return () => modes.setNormal()
	})

	test('should be add note', async () => {
		const { pos, box } = getBoxAndPosByKind(boardStore, BoxKinds.Empty)!

		expect(box).not.toBeUndefined()
		expect(box.value).toBe(0)

		render(Box, { props: pos })
		const button = screen.getByTestId(`${pos.row}-${pos.col}`)
		const notes = screen.getByTestId('notes')

		await fireEvent.click(button)
		await fireEvent.keyDown(button, { key: '3' })

		expect(notes).toHaveTextContent('3')
		expect(notes).toBeVisible()
	})
	test('should not visible value', async () => {
		const { pos, box } = getBoxAndPosByKind(boardStore, BoxKinds.Empty)!

		expect(box).not.toBeUndefined()
		expect(box.value).toBe(0)

		render(Box, { props: pos })
		const button = screen.getByTestId(`${pos.row}-${pos.col}`)
		const value = screen.getByTestId('value')

		await fireEvent.click(button)
		await fireEvent.keyDown(button, { key: '3' })

		expect(value).not.toBeVisible()
	})
	test('should be render notes', async () => {
		const { pos, box } = getBoxAndPosByKind(boardStore, BoxKinds.Empty)!

		expect(box).not.toBeUndefined()
		expect(box.value).toBe(0)

		render(Box, { props: pos })
		const button = screen.getByTestId(`${pos.row}-${pos.col}`)
		const note3 = screen.getByTestId('note-3')
		const note9 = screen.getByTestId('note-9')

		await fireEvent.click(button)
		await fireEvent.keyDown(button, { key: '3' })
		await fireEvent.click(button)
		await fireEvent.keyDown(button, { key: '9' })

		expect(note3).toBeVisible()
		expect(note9).toBeVisible()
	})
})
