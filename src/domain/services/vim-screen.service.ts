import {
	SplitKinds,
	type IVimScreenService,
	WindowKinds,
	defaultScreen,
	type VimScreen,
	type WindowSplit,
} from '../models'
import type { Observer } from '../utils'

export class VimScreenService implements IVimScreenService {
	#prevSplit?: SplitKinds | null
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

	setWindow(newWindow: WindowKinds) {
		this.#prevSplit = null
		this.#value = { window: newWindow }
		this.#notifyObservers()
	}
	addSplit(newSplit: WindowSplit) {
		this.#prevSplit = newSplit.kind === this.#prevSplit ? null : this.#value.split?.kind
		this.#value = { ...this.#value, split: newSplit }
		this.#notifyObservers()
	}
	undo() {
		if (this.#value.split == null) {
			if (this.#value.window == WindowKinds.Init) return

			this.setWindow(WindowKinds.Init)
		} else {
			if (this.#prevSplit == null) this.setWindow(this.#value.window)
			else this.addSplit({ kind: this.#prevSplit, position: 'full' })
		}
	}
}
