export function createArrayMap<T>(length: number, mapFn: (index: number) => T) {
	const array = []
	for (let i = 0; i < length; i++) {
		array[i] = mapFn(i)
	}
	return array
}

export function createEmptyBoard(length = 9) {
	const array: number[][] = []
	for (let i = 0; i < length; i++) {
		array[i] = []
		for (let j = 0; j < length; j++) array[i][j] = 0
	}
	return array
}
