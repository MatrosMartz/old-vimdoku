import { describe, expect, test } from 'vitest'

import { isCorrectSolution } from '~/domain/utils'

import { Solution } from './solution.entity'

const solution = new Solution()

describe.concurrent('Create Solution', () => {
	test('Should return array', () => {
		expect(Array.isArray(solution.value)).toBe(true)
	})
	test('Should be array length is 9', () => {
		expect(solution.value).toHaveLength(9)
	})
	test('The length of columns should be nine', () => {
		expect(solution.value.every(col => col.length === 9)).toBe(true)
	})
	test('All boxes should be numbers', () => {
		expect(solution.value.every(col => col.every(box => typeof box === 'number'))).toBe(true)
	})
	test('All boxes should be contain numbers from one to nine', () => {
		expect(solution.value.every(col => col.every(box => box > 0 && box < 10))).toBe(true)
	})
	test('Should be solution are correct', () => {
		expect(isCorrectSolution(solution.value)).toBe(true)
	})
})
