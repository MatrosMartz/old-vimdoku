export interface Observer<T> {
	update: (value: T) => void
}

export interface Observable<T> {
	addObserver: (observer: Observer<T>) => void
	removeObserver: (observer: Observer<T>) => void
	readonly value: Readonly<T>
}
