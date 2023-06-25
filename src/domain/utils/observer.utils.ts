import type { Subscriber, Unsubscriber } from 'svelte/store'

export interface Observer<T> {
	update: (value: T) => void
}

export interface Observable<T> {
	addObserver: (Observer: Observer<T>) => void
	removeObserver: (Observer: Observer<T>) => void
}

export type CustomSubscribe<T> = (run: Subscriber<T>) => Unsubscriber
