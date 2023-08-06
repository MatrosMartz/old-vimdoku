import { BoardErrors, createArray } from '~/domain/utils'

interface INotes {
	readonly value: ReadonlyArray<number | null>
	toggleNote(note: number): void
}

export class Notes implements INotes {
	#value = createArray<number | null>(9, { value: null })

	constructor(initialNotes?: readonly number[]) {
		if (initialNotes != null) for (const note of initialNotes) this.#value[note - 1] = note
	}

	get value() {
		return Object.freeze([...this.#value])
	}

	toggleNote(note: number) {
		if (note < 0 || note > 9) throw new BoardErrors.InvalidValue({ type: 'note', value: note })

		if (note === 0) this.#value = createArray(9, { value: null })
		else if (this.#value[note - 1] != null) this.#removeNote(note)
		else this.#addNote(note)
	}

	#addNote(note: number) {
		this.#value[note - 1] = note
	}

	#removeNote(note: number) {
		this.#value[note - 1] = null
	}
}
