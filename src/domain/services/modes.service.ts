import { type IModesService, Modes } from '~/domain/models'

import type { Observer } from '../utils'

export class ModesService implements IModesService {
	#value: Modes
	#observers: Array<Observer<Modes>> = []

	constructor({ initialMode = Modes.Normal }: { initialMode?: Modes } = {}) {
		this.#value = initialMode
	}

	get value() {
		return this.#value
	}

	addObserver(observer: Observer<Modes>) {
		this.#observers = [...this.#observers, observer]
	}

	removeObserver(observer: Observer<Modes>) {
		this.#observers = this.#observers.filter(obs => obs !== observer)
	}

	setAnnotation() {
		this.#value = Modes.Annotation
		this.#notifyObservers()
	}

	setCommand() {
		this.#value = Modes.Command
		this.#notifyObservers()
	}

	setInsert() {
		this.#value = Modes.Insert
		this.#notifyObservers()
	}

	setNormal() {
		this.#value = Modes.Normal
		this.#notifyObservers()
	}

	#notifyObservers() {
		this.#observers.forEach(obs => {
			obs.update(this.#value)
		})
	}
}
