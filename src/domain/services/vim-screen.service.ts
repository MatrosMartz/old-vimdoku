import {
	defaultScreen,
	type HelpWindowOpts,
	type IVimScreenService,
	type SetsWindowOpts,
	SetType,
	type VimScreen,
	WindowPrimaryKinds,
	WindowSecondaryKinds,
	type WindowSecondaryOpts,
	type WindowSecondaryOptsAll,
} from '../models'
import type { Observer } from '../utils'

export class VimScreenService implements IVimScreenService {
	#prevSplit?: WindowSecondaryOpts | null
	#observers: Array<Observer<VimScreen>> = []
	#value: VimScreen

	constructor({ initialWindow = defaultScreen }: { initialWindow?: VimScreen } = {}) {
		this.#value = initialWindow
	}

	get value() {
		return this.#value
	}

	addObserver(observer: Observer<VimScreen>) {
		this.#observers = [...this.#observers, observer]
	}

	getOptForKey<K extends keyof WindowSecondaryOptsAll>(key: K) {
		const secondary = (this.#value.secondary ?? {}) as WindowSecondaryOptsAll
		if (key in secondary) return secondary[key]
		throw new Error(`not exist "${key}" option in secondary window`)
	}

	removeObserver(observer: Observer<VimScreen>) {
		this.#observers = this.#observers.filter(obs => obs !== observer)
	}

	removeSecondary() {
		this.#setPrimaryWindow(this.#value.primary)
	}

	setGameWindow() {
		this.#setPrimaryWindow(WindowPrimaryKinds.Game)
	}

	// eslint-disable-next-line no-empty-pattern
	setHelpSecondary({}: Partial<HelpWindowOpts> = {}) {
		this.#updateSplit({ kind: WindowSecondaryKinds.Help })
	}

	setInitWindow() {
		this.#setPrimaryWindow(WindowPrimaryKinds.Init)
	}

	setSetsSecondary({ setType = SetType.edit }: Partial<SetsWindowOpts> = {}) {
		this.#updateSplit({ kind: WindowSecondaryKinds.Sets, setType })
	}

	undo() {
		if (this.#value.secondary == null) {
			if (this.#value.primary !== WindowPrimaryKinds.Init) {
				this.#setPrimaryWindow(WindowPrimaryKinds.Init)
			}
		} else {
			if (this.#prevSplit == null) this.removeSecondary()
			else this.#updateSplit({ ...this.#prevSplit })
		}
	}

	#notifyObservers() {
		this.#observers.forEach(obs => {
			obs.update(this.#value)
		})
	}

	#setPrimaryWindow(newWindow: WindowPrimaryKinds) {
		this.#prevSplit = null
		this.#value = { primary: newWindow }
		this.#notifyObservers()
	}

	#updateSplit(newSplit: WindowSecondaryOpts) {
		this.#prevSplit = newSplit.kind === this.#prevSplit?.kind ? null : this.#value.secondary
		this.#value = { ...this.#value, secondary: { ...(this.#value.secondary ?? {}), ...newSplit } }
		this.#notifyObservers()
	}
}
