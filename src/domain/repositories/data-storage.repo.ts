export interface DataStorageRepo<T> {
	get: () => T | null
	set: (data: T) => void
}
