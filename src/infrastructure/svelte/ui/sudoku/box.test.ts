import { cleanup, fireEvent, render, screen } from '@testing-library/svelte'
import { afterEach, beforeAll, describe, expect, test } from 'vitest'

import { Solution } from '~/domain/entities'
import { BoxKinds } from '~/domain/models'
import { getBoxAndPosByKind } from '~/tests/utils'
import { board, modes } from '$infra/svelte/stores'

import Box from './box.svelte'

const solution = new Solution()

afterEach(() => {
	cleanup()
})

describe('Box Component in Insert Mode', () => {
	beforeAll(() => {
		modes.setInsert()
		board.initBoard({ solution })
		return () => {
			modes.setNormal()
		}
	})

	describe('Box Component Empty', () => {
		test('should be selectable', async () => {
			render(Box, { props: { row: 1, col: 1 } })
			const button = screen.getByTestId('1-1')

			expect(button).not.toHaveClass('selected')

			await fireEvent.click(button)

			expect(button).toHaveClass('selected')
		})
	})
	describe('Box Component Empty', () => {
		test('should write three', async () => {
			const { pos } = getBoxAndPosByKind(board, BoxKinds.Empty)!

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
			const { pos } = getBoxAndPosByKind(board, BoxKinds.Empty)!

			expect(pos).not.toBeUndefined()

			render(Box, { props: pos })
			const button = screen.getByTestId(`${pos.row}-${pos.col}`)

			await fireEvent.click(button)
			await fireEvent.keyDown(button, { key: '3' })

			expect(button).not.toHaveClass('selected')
		})
		test('should delete number with press zero', async () => {
			const { pos } = getBoxAndPosByKind(board, BoxKinds.Empty)!

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
			const { pos } = getBoxAndPosByKind(board, BoxKinds.Empty)!

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
			const { pos } = getBoxAndPosByKind(board, BoxKinds.Initial)!

			expect(pos).not.toBeUndefined()

			render(Box, { props: pos })
			const button = screen.getByTestId(`${pos.row}-${pos.col}`)

			expect(button).toHaveClass('initial')
		})
		test('should not write', async () => {
			const { pos, box } = getBoxAndPosByKind(board, BoxKinds.Initial)!

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
