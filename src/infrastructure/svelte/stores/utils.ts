import type { Readable, Subscriber } from 'svelte/store'
import type { Observable, Observer } from '~/domain/utils'

export function storeFromObservable<T>(observable: Observable<T>): Readable<T> {
	function subscribe(update: Subscriber<T>) {
		update(observable.value)

		const observer: Observer<T> = { update }

		observable.addObserver(observer)

		return () => observable.removeObserver(observer)
	}

	return { subscribe }
}
