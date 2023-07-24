import { createArrayMap } from '~/domain/utils'

interface INotes {
	addNote: (note: number) => void
	readonly value: readonly (number | null)[]
	removeNote: (note: number) => void
	toggleNote: (note: number) => void
}

export class Notes implements INotes {
	#value = createArrayMap<number | null>(9, () => null)

	constructor(initialNotes?: number[]) {
		if (initialNotes != null) for (const note of initialNotes) this.#value[note - 1] = note
	}

	addNote(note: number) {
		this.#value[note - 1] = note
	}
	removeNote(note: number) {
		this.#value[note - 1] = null
	}

	toggleNote(note: number) {
		if (note < 0 && note > 9) throw new Error(`'${note}' can not be a note`)

		if (note === 0) this.#value = createArrayMap(9, () => null)
		else if (this.#value[note - 1]) this.removeNote(note)
		else this.addNote(note)
	}
	get value() {
		return Object.freeze([...this.#value])
	}
}
