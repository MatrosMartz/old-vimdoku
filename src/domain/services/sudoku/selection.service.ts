import type { ISelectionService, Position } from '~/domain/models'
import type { Observer } from '~/domain/utils'

function min(value: number, { min, max }: { min: number; max?: number }) {
	return value < min ? min : max == null ? value : max
}
function max(value: number, { min, max }: { min?: number; max: number }) {
	return value > max ? max : min == null ? value : min
}

export class SelectionService implements ISelectionService {
	static MAX_BOX_POS = 8
	static MIN_BOX_POS = 0
	#value: Position
	#observers: Observer<Position>[] = []

	#isEndPosition = () => this.#value.row === 8 && this.#value.col === 8
	#isStartPosition = () => this.#value.row === 0 && this.#value.col === 0

	constructor({ initialPosition = { col: 0, row: 0 } }: { initialPosition?: Position } = {}) {
		this.#value = initialPosition
	}

	#notifyObservers() {
		this.#observers.forEach(obs => obs.update({ ...this.#value }))
	}
	addObserver(observer: Observer<Position>) {
		this.#observers = [...this.#observers, observer]
	}
	removeObserver(observer: Observer<Position>) {
		this.#observers = this.#observers.filter(obs => obs !== observer)
	}
	get value() {
		return Object.freeze(this.#value)
	}

	moveTo(newPosition: Position) {
		this.#value = newPosition
		this.#notifyObservers()
	}
	moveDown(times = 1) {
		if (this.#isEndPosition()) return
		times = min(times, { min: 1 })

		const row = this.#value.row + times
		const col = max(row, { max: SelectionService.MAX_BOX_POS, min: this.#value.col })

		this.moveTo({ row: max(row, { max: SelectionService.MAX_BOX_POS }), col })
	}
	moveLeft(times = 1) {
		if (this.#isStartPosition()) return
		times = min(times, { min: 1 })

		const col = this.#value.col - times
		const isComesOut = col < SelectionService.MIN_BOX_POS
		const row = this.#value.row + (isComesOut ? -1 : 0)

		this.moveTo({ row, col: isComesOut ? SelectionService.MAX_BOX_POS : col })
	}
	moveRight(times = 1) {
		if (this.#isEndPosition()) return
		times = min(times, { min: 1 })

		const col = this.#value.col + times
		const row = this.#value.row + Math.trunc(col / 9)

		this.moveTo({ row, col: col % 9 })
	}
	moveUp(times = 1) {
		if (this.#isStartPosition()) return
		times = min(times, { min: 1 })

		const row = this.#value.row - times
		const col = min(row, { min: SelectionService.MIN_BOX_POS, max: this.#value.col })

		this.moveTo({ row: min(row, { min: SelectionService.MIN_BOX_POS }), col })
	}
	moveToNextEmpty(emptiesPos: readonly Position[]) {
		const { row, col } = this.#value
		const actualIndex = emptiesPos.findIndex(box => row === box.row && col === box.col)
		const nextEmptyIndex = actualIndex + 1 < emptiesPos.length ? actualIndex + 1 : 0
		this.moveTo({ ...emptiesPos[nextEmptyIndex] })
	}
}
