import type { ISelectionService, Position } from '~/domain/models'
import type { Observer } from '~/domain/utils'

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
	getValue = () => Object.freeze(this.#value)

	moveTo(newPosition: Position) {
		this.#value = newPosition
		this.#notifyObservers()
	}
	moveDown(times = 1) {
		if (this.#isEndPosition()) return

		const row = this.#value.row + times
		const rowIsMax = row > SelectionService.MAX_BOX_POS
		const col = rowIsMax ? SelectionService.MAX_BOX_POS : this.#value.col

		this.moveTo({ row: rowIsMax ? SelectionService.MAX_BOX_POS : row, col })
	}
	moveLeft(times = 1) {
		if (this.#isStartPosition()) return

		const col = this.#value.col - times
		const colIxMin = col < SelectionService.MIN_BOX_POS
		const row = this.#value.row + (colIxMin ? col : SelectionService.MIN_BOX_POS)

		this.moveTo({
			row,
			col: colIxMin ? col + 9 : col,
		})
	}
	moveRight(times = 1) {
		if (this.#isEndPosition()) return

		const col = this.#value.col + times
		const row = this.#value.row + Math.trunc(col / 9)

		this.moveTo({ row, col: col % 9 })
	}
	moveUp(times = 1) {
		if (this.#isStartPosition()) return

		const row = this.#value.row - times
		const rowISMin = row < SelectionService.MIN_BOX_POS
		const col = rowISMin ? SelectionService.MIN_BOX_POS : this.#value.col

		this.#value = { row: rowISMin ? SelectionService.MIN_BOX_POS : row, col }
	}
	moveToNextEmpty(emptiesPos: readonly Position[]) {
		const { row, col } = this.#value
		const actualIndex = emptiesPos.findIndex(box => row === box.row && col === box.col)
		const nextEmptyIndex = actualIndex + 1 < emptiesPos.length ? actualIndex + 1 : 0
		this.moveTo({ ...emptiesPos[nextEmptyIndex] })
	}
}
