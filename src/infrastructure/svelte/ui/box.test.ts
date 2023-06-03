import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/svelte'

import { BoxKinds } from '~/domain/models'
import { getBoxAndPosByKind } from '~/tests/utils'

import Box from './box.svelte'
import { sudokuStore } from '../stores'

afterEach(() => cleanup())

describe('Box Component Empty', () => {
	test('should be selectable', async () => {
		render(Box, { props: { row: 0, col: 0 } })
		const button = screen.getByTestId('0-0')

		expect(button).not.toHaveClass('selected')

		await fireEvent.click(button)

		expect(button).toHaveClass('selected')
	})
})
describe('Box Component Empty', () => {
	test('should write three', async () => {
		const { pos } = getBoxAndPosByKind(sudokuStore, BoxKinds.Empty)!

		expect(pos).not.toBeUndefined()

		render(Box, { props: pos })
		const button = screen.getByTestId(`${pos.row}-${pos.col}`)

		expect(button).toHaveTextContent('')

		await fireEvent.click(button)
		await fireEvent.keyDown(button, { key: '3' })

		expect(button).toHaveTextContent('3')
	})
	test('should deselected after write', async () => {
		const { pos } = getBoxAndPosByKind(sudokuStore, BoxKinds.Empty)!

		expect(pos).not.toBeUndefined()

		render(Box, { props: pos })
		const button = screen.getByTestId(`${pos.row}-${pos.col}`)

		expect(button).toHaveTextContent('')

		await fireEvent.click(button)
		await fireEvent.keyDown(button, { key: '3' })

		expect(button).not.toHaveClass('selected')
	})
	test('should delete number with press zero', async () => {
		const { pos } = getBoxAndPosByKind(sudokuStore, BoxKinds.Empty)!

		expect(pos).not.toBeUndefined()

		render(Box, { props: pos })
		const button = screen.getByTestId(`${pos.row}-${pos.col}`)

		await fireEvent.click(button)
		await fireEvent.keyDown(button, { key: '3' })

		expect(button).toHaveTextContent('3')

		await fireEvent.click(button)
		await fireEvent.keyDown(button, { key: '0' })

		expect(button).toHaveTextContent('')
	})
	test('should delete number with press Backspace', async () => {
		const { pos } = getBoxAndPosByKind(sudokuStore, BoxKinds.Empty)!

		expect(pos).not.toBeUndefined()

		render(Box, { props: pos })
		const button = screen.getByTestId(`${pos.row}-${pos.col}`)

		await fireEvent.click(button)
		await fireEvent.keyDown(button, { key: '3' })

		expect(button).toHaveTextContent('3')

		await fireEvent.click(button)
		await fireEvent.keyDown(button, { code: 'BackSpace' })

		expect(button).toHaveTextContent('')
	})
})
describe('Box Component Initial', () => {
	test('should have initial class', async () => {
		const { pos } = getBoxAndPosByKind(sudokuStore, BoxKinds.Initial)!

		expect(pos).not.toBeUndefined()

		render(Box, { props: pos })
		const button = screen.getByTestId(`${pos.row}-${pos.col}`)

		expect(button).toHaveClass('initial')
	})
	test('should not write', async () => {
		const { pos, box } = getBoxAndPosByKind(sudokuStore, BoxKinds.Initial)!

		expect(pos).not.toBeUndefined()
		expect(box.value).not.toBe(0)

		render(Box, { props: pos })
		const button = screen.getByTestId(`${pos.row}-${pos.col}`)

		expect(button).toHaveTextContent(String(box.value))

		await fireEvent.click(button)
		await fireEvent.keyDown(button, { key: '3' })

		expect(button).not.toHaveClass('selected')
	})
})
