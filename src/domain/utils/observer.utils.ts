export interface Observer<T> {
	update(value: T): void
}

export interface Observable<T> {
	readonly value: Readonly<T>
	addObserver(observer: Observer<T>): void
	removeObserver(observer: Observer<T>): void
}
