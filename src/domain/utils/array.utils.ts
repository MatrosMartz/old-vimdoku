import type { Position } from '../models'

export function createArray<T>(length: number, map: { fn: (index: number) => T } | { value: T }) {
	const array = []
	for (let i = 0; i < length; i++) array[i] = 'fn' in map ? map.fn(i) : map.value
	return array
}

export function createMatrix<T>(length: number, map: { fn: (pos: Position) => T }): T[][]
export function createMatrix<T>(length: number, map: { value: T }): T[][]
export function createMatrix<T>(length: number, map: { fn: (pos: Position) => T } | { value: T }) {
	if ('fn' in map)
		return createArray(length, {
			fn: row => createArray(length, { fn: col => map.fn({ row, col }) }),
		})
	return createArray(length, { fn: () => createArray(length, { value: map.value }) })
}
