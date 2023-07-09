import {
	type IVimScreenService,
	defaultScreen,
	type VimScreen,
	type WindowSecondaryOpts,
	WindowPrimaryKinds,
	type WindowSecondaryOptsAll,
	type HelpWindowOpts,
	WindowSecondaryKinds,
	type SetsWindowOpts,
	SetType,
} from '../models'
import type { Observer } from '../utils'

export class VimScreenService implements IVimScreenService {
	#prevSplit?: WindowSecondaryOpts | null
	#value: VimScreen
	#observers: Observer<VimScreen>[] = []

	constructor({ initialWindow = defaultScreen }: { initialWindow?: VimScreen } = {}) {
		this.#value = initialWindow
	}

	#notifyObservers() {
		this.#observers.forEach(obs => obs.update(this.#value))
	}
	addObserver(observer: Observer<VimScreen>) {
		this.#observers = [...this.#observers, observer]
	}
	removeObserver(observer: Observer<VimScreen>) {
		this.#observers = this.#observers.filter(obs => obs !== observer)
	}
	getValue = () => this.#value
	#setPrimaryWindow(newWindow: WindowPrimaryKinds) {
		this.#prevSplit = null
		this.#value = { primary: newWindow }
		this.#notifyObservers()
	}
	getOptForKey<K extends keyof WindowSecondaryOptsAll>(key: K) {
		const secondary = (this.#value.secondary ?? {}) as WindowSecondaryOptsAll
		if (key in secondary) return secondary[key]
		throw new Error(`not exist "${key}" option in secondary window`)
	}

	removeSecondary() {
		this.#setPrimaryWindow(this.#value.primary)
	}
	setGameWindow() {
		this.#setPrimaryWindow(WindowPrimaryKinds.Game)
	}
	setInitWindow() {
		this.#setPrimaryWindow(WindowPrimaryKinds.Init)
	}
	#updateSplit(newSplit: WindowSecondaryOpts) {
		this.#prevSplit = newSplit.kind === this.#prevSplit?.kind ? null : this.#value.secondary
		this.#value = { ...this.#value, secondary: { ...(this.#value.secondary ?? {}), ...newSplit } }
		this.#notifyObservers()
	}
	setHelpSecondary({}: Partial<HelpWindowOpts> = {}) {
		this.#updateSplit({ kind: WindowSecondaryKinds.Help })
	}
	setSetsSecondary({ setType = SetType.edit }: Partial<SetsWindowOpts> = {}) {
		this.#updateSplit({ kind: WindowSecondaryKinds.Sets, setType })
	}
	undo() {
		if (this.#value.secondary == null) {
			if (this.#value.primary != WindowPrimaryKinds.Init)
				this.#setPrimaryWindow(WindowPrimaryKinds.Init)
		} else {
			if (this.#prevSplit == null) this.removeSecondary()
			else this.#updateSplit({ ...this.#prevSplit })
		}
	}
}
