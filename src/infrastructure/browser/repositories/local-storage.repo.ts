import type { DataStorageRepo } from '~/domain/repositories'

export class DataStorageBrowser<T> implements DataStorageRepo<T> {
	#keyName: string

	constructor({ keyName }: { keyName: string }) {
		this.#keyName = keyName
		if (!('localStorage' in window)) throw new Error('localStorage not defined')
	}

	get = () => {
		const data = window.localStorage.getItem(this.#keyName)

		return data != null ? (JSON.parse(data) as T) : null
	}
	set = (data: T) => {
		const dataStringify = JSON.stringify(data)
		window.localStorage.setItem(this.#keyName, dataStringify)
	}
}
