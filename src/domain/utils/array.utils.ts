export function createArrayMap<T>(length: number, mapFn: (index: number) => T) {
	const array = []
	for (let i = 0; i < length; i++) {
		array[i] = mapFn(i)
	}
	return array
}
