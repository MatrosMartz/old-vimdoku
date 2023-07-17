export interface DataRepo<T> {
	get: () => T | null
	set: (data: T) => void
}
