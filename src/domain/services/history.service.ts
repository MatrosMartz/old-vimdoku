import type { HistoryData, HistoryServiceSchema } from '../models'

class HistoryService implements HistoryServiceSchema {
	#history: string[] = []
	#index: number = null
	#updateData: (history: string[]) => void = null

	setHistory = (from?: HistoryData) => {
		if (from) {
			this.#history = from.getActual()
			this.#updateData = from.update
		}
		this.#index = this.#history.length
		this.#updateData = null
	}

	getCurrent = () => {
		return this.#history[this.#index] ?? ''
	}
	getHistory = () => this.#history
	initialHistory = () => this.#history
	push = (cmd: string) => {
		this.#history = [...this.#history, cmd]
		this.#index = this.#history.length

		this.#updateData?.(this.#history)

		return null
	}
	redo = () => {
		if (this.#index < this.#history.length - 1) this.#index += 1
	}
	undo = () => {
		if (this.#index > 0) this.#index -= 1
		else this.#index = 0
	}
}

export const historyService = new HistoryService()
