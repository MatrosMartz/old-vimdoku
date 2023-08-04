import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import { Notes, Solution } from '~/domain/entities'
import { BoxKinds, type BoardOpts, type BoxSchema, type BoardSchema } from '~/domain/models'

import { BoardService } from './board.service'
import { SelectionService } from './selection.service'
import type { IBoardRepo } from '~/domain/repositories'
import { boardEach, createMatrix } from '~/domain/utils'

const solution = new Solution()
const mockBoardRepo = (): IBoardRepo => {
	let value: { board: BoardSchema | null; opts: BoardOpts | null } = { board: null, opts: null }
	return {
		getBoard: () => {
			if (value.board == null) return null
			const copyBoard = createMatrix(9, { value: {} as BoxSchema })
			boardEach(({ row, col }) => {
				const box = value.board![row][col]
				const notes = new Notes(box.notes.value.filter(n => n != null) as number[])

				copyBoard[row][col] = { ...box, notes }
			})

			return copyBoard
		},
		setBoard: newBoard => (value.board = newBoard),
		getOpts: () => ({
			difficulty: value.opts?.difficulty!,
			solution: new Solution({ initialSolution: value.opts?.solution.value }),
		}),
		setOpts: newOpts => (value.opts = newOpts),
		update: updater => {
			value = updater({ board: value.board!, opts: value.opts! })
		},
		delete: () => (value = { board: null, opts: null }),
	}
}
let board: BoardService, selection: SelectionService
const standardBox: BoxSchema = {
	notes: new Notes(),
	kind: BoxKinds.Empty,
	value: BoardService.EMPTY_BOX_VALUE,
}

describe.concurrent('Sudoku Board', () => {
	beforeAll(() => {
		vi.useFakeTimers()
		return () => vi.useRealTimers()
	})

	beforeEach(() => {
		selection = new SelectionService()
		board = new BoardService({ selectionService: selection, boardRepo: mockBoardRepo() })
		board.initBoard({ solution })
		vi.advanceTimersByTime(0)
	})

	test('Not all box should be initials', () => {
		const everyIsInitial = board
			.getBoard()
			.every(col => col.every(box => box.kind === BoxKinds.Initial))
		expect(everyIsInitial).toBe(false)
	})

	describe('Write Number', () => {
		test('Should change the status to incorrect', () => {
			const initialBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Initial)!
			const correctValue = board.getSudokuValue(initialBoxPos)
			const incorrectValue = correctValue > 9 ? 1 : correctValue + 1

			selection.moveTo(initialBoxPos)
			board.toggleNumber(incorrectValue)

			const box = board.getBox(initialBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				kind: BoxKinds.Initial,
				value: correctValue,
			})
		})
		test('Should change the status to incorrect', () => {
			const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!
			const correctValue = board.getSudokuValue(voidBoxPos)
			const incorrectValue = correctValue > 9 ? 1 : correctValue + 1

			selection.moveTo(voidBoxPos)
			board.toggleNumber(incorrectValue)

			const box = board.getBox(voidBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				kind: BoxKinds.Incorrect,
				value: incorrectValue,
			})
		})
		test('Should change the status to correct', () => {
			const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!
			const correctValue = board.getSudokuValue(voidBoxPos)

			selection.moveTo(voidBoxPos)
			board.toggleNumber(correctValue)

			const box = board.getBox(voidBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				kind: BoxKinds.Correct,
				value: correctValue,
			})
		})
		test('should reset notes', () => {
			const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!
			const correctValue = board.getSudokuValue(voidBoxPos)

			selection.moveTo(voidBoxPos)
			board.toggleNote(1)
			board.toggleNumber(correctValue)

			const box = board.getBox(voidBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				kind: BoxKinds.Correct,
				value: correctValue,
			})
		})
	})

	describe('Add Notes', () => {
		test('Should change the status to notes', () => {
			const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!

			selection.moveTo(voidBoxPos)
			board.toggleNote(1)

			const box = board.getBox(voidBoxPos)
			expect(box).toMatchObject<BoxSchema>({
				...standardBox,
				kind: BoxKinds.WhitNotes,
				notes: new Notes([1]),
			})
		})
	})
	test('should arrange the notes correctly', () => {
		const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!

		selection.moveTo(voidBoxPos)
		board.toggleNote(3)
		board.toggleNote(9)
		board.toggleNote(1)
		board.toggleNote(2)

		const box = board.getBox(voidBoxPos)
		expect(box).toMatchObject<BoxSchema>({
			...standardBox,
			kind: BoxKinds.WhitNotes,
			notes: new Notes([1, 2, 3, 9]),
		})
	})
	test('should not repeat notes', () => {
		const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!

		selection.moveTo(voidBoxPos)
		board.toggleNote(1)
		board.toggleNote(1)

		const box = board.getBox(voidBoxPos)
		expect(box).toMatchObject<BoxSchema>({
			...standardBox,
			kind: BoxKinds.WhitNotes,
			notes: new Notes([1]),
		})
	})
	test('should reset value', () => {
		const voidBoxPos = BoardService.getFirstBoxWithKind(board.getBoard(), BoxKinds.Empty)!

		selection.moveTo(voidBoxPos)
		board.toggleNumber(9)
		board.toggleNote(1)
		board.toggleNote(1)

		const box = board.getBox(voidBoxPos)
		expect(box).toMatchObject<BoxSchema>({
			...standardBox,
			kind: BoxKinds.WhitNotes,
			notes: new Notes([1]),
		})
	})
})
