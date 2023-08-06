export interface DataRepo<T> {
	delete(): void
	get(): T | null
	set(data: T): void
}
