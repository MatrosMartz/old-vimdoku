import { describe, expect, test } from 'vitest'

import { Solution } from './solution.entity'
import { getSectorsForSolution } from '~/tests/utils'

const solution = new Solution()

describe('Create Solution', () => {
	test.concurrent('Should return array', () => {
		expect(Array.isArray(solution.value)).toBe(true)
	})
	test.concurrent('Should be array length is 9', () => {
		expect(solution.value).toHaveLength(9)
	})
	test.concurrent('The length of columns should be nine', () => {
		expect(solution.value.every(col => col.length === 9)).toBe(true)
	})
	test.concurrent('All boxes should be numbers', () => {
		expect(solution.value.every(col => col.every(box => typeof box === 'number'))).toBe(true)
	})
	test.concurrent('All boxes should be contain numbers from one to nine', () => {
		expect(solution.value.every(col => col.every(box => 0 < box && box < 10))).toBe(true)
	})

	describe('solution are correct', () => {
		const { cols, quadrants, rows } = getSectorsForSolution(solution.value)
		test.concurrent.each([
			{ name: 'columns', actual: cols },
			{ name: 'quadrants', actual: quadrants },
			{ name: 'rows', actual: rows },
		])('$name should be contain only different numbers', ({ actual }) => {
			expect(actual.every(value => value.size === 9)).toBe(true)
		})
	})
})
