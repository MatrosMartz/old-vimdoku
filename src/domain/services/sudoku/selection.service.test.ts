import { beforeEach, describe, expect, test } from 'vitest'

import type { Position } from '~/domain/models'

import { SelectionService } from './selection.service'

describe('selection Move', () => {
	let selection: SelectionService

	beforeEach(() => {
		selection = new SelectionService()
	})

	describe.concurrent('Left', () => {
		test.concurrent('should move to the left', () => {
			const initialPosition: Position = { col: 8, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveLeft()
			const actualPosition = selection.getValue()

			expect(actualPosition).toEqual<Position>({ col: 7, row: 0 })
		})
		test.concurrent('should move to the left and up column', () => {
			const initialPosition: Position = { col: 0, row: 8 }
			selection.moveTo(initialPosition)
			selection.moveLeft()
			const actualPosition = selection.getValue()

			expect(actualPosition).toEqual<Position>({ col: 8, row: 7 })
		})
		test.concurrent('should not move to the left if column and row are zero', () => {
			const initialPosition: Position = { col: 0, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveLeft()
			const actualPosition = selection.getValue()

			expect(actualPosition).toEqual<Position>({ col: 0, row: 0 })
		})
	})

	describe.concurrent('Right', () => {
		test.concurrent('should move to the right', () => {
			const initialPosition: Position = { col: 0, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveRight()
			const actualPosition = selection.getValue()

			expect(actualPosition).toEqual<Position>({ col: 1, row: 0 })
		})
		test.concurrent('should move to the right and down column', () => {
			const initialPosition: Position = { col: 8, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveRight()
			const actualPosition = selection.getValue()

			expect(actualPosition).toEqual<Position>({ col: 0, row: 1 })
		})

		test.concurrent('should not move to the right if column and row are 8', () => {
			const initialPosition: Position = { col: 8, row: 8 }
			selection.moveTo(initialPosition)
			selection.moveRight()
			const actualPosition = selection.getValue()

			expect(actualPosition).toEqual<Position>({ col: 8, row: 8 })
		})
	})

	describe.concurrent('Down', () => {
		test.concurrent('should move to the down', () => {
			const initialPosition: Position = { col: 0, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveDown()
			const actualPosition = selection.getValue()

			expect(actualPosition).toEqual<Position>({ col: 0, row: 1 })
		})
		test.concurrent('should move to the end if column is 8 ', () => {
			const initialPosition: Position = { col: 0, row: 8 }
			selection.moveTo(initialPosition)
			selection.moveDown()
			const actualPosition = selection.getValue()

			expect(actualPosition).toEqual<Position>({ col: 8, row: 8 })
		})

		test.concurrent('should not move to the down if column and row are 8', () => {
			const initialPosition: Position = { col: 8, row: 8 }
			selection.moveTo(initialPosition)
			selection.moveDown()
			const actualPosition = selection.getValue()

			expect(actualPosition).toEqual<Position>({ col: 8, row: 8 })
		})
	})

	describe.concurrent('Up', () => {
		test.concurrent('should move to the up', () => {
			const initialPosition: Position = { col: 8, row: 8 }
			selection.moveTo(initialPosition)
			selection.moveUp()
			const actualPosition = selection.getValue()

			expect(actualPosition).toEqual<Position>({ col: 8, row: 7 })
		})
		test.concurrent('should move to the start if column is 0', () => {
			const initialPosition: Position = { col: 8, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveUp()
			const actualPosition = selection.getValue()

			expect(actualPosition).toEqual<Position>({ col: 0, row: 0 })
		})

		test.concurrent('should not move to the up if column and row are 0', () => {
			const initialPosition: Position = { col: 0, row: 0 }
			selection.moveTo(initialPosition)
			selection.moveUp()
			const actualPosition = selection.getValue()

			expect(actualPosition).toEqual<Position>({ col: 0, row: 0 })
		})
	})
})
