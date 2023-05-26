export function createArray<T>(length: number, mapFn: (index: number) => T) {
	return Array.from({ length }, (_, index) => mapFn(index))
}
