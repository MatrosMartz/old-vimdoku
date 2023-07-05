import {
	SplitKinds,
	type IVimScreenService,
	WindowKinds,
	defaultScreen,
	type VimScreen,
	type WindowSplit,
	type SplitPosition,
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
	getSplit = () => this.#value.split?.kind

	removeSplit() {
		this.setWindow(this.#value.window)
	}
	setWindow(newWindow: WindowKinds) {
		this.#prevSplit = null
		this.#value = { window: newWindow }
		this.#notifyObservers()
	}
	#updateSplit(newSplit: WindowSplit) {
		this.#prevSplit = newSplit.kind === this.#prevSplit ? null : this.#value.split?.kind
		this.#value = { ...this.#value, split: { ...(this.#value.split ?? {}), ...newSplit } }
		this.#notifyObservers()
	}
	setHelpSplit(position: SplitPosition = 'full') {
		this.#updateSplit({ kind: SplitKinds.Help, position })
	}
	setSetsSplit(position: SplitPosition = 'full') {
		this.#updateSplit({ kind: SplitKinds.Sets, position })
	}
	undo() {
		if (this.#value.split == null) {
			if (this.#value.window != WindowKinds.Init) this.setWindow(WindowKinds.Init)
		} else {
			if (this.#prevSplit == null) this.removeSplit()
			else this.#updateSplit({ kind: this.#prevSplit, position: 'full' })
		}
	}
}
