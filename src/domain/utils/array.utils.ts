export function createArray<T>(length: number, map: { fn: (index: number) => T } | { value: T }) {
	const array = []
	for (let i = 0; i < length; i++) array[i] = 'fn' in map ? map.fn(i) : map.value
	return array
}
