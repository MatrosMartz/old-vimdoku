export class PreferenceError extends Error {
	constructor({ kind = 'property' }: { kind?: 'property' | 'value' } = {}) {
		super(kind === 'property' ? 'preference does not exits' : 'value is incorrect')
	}
}

class InvalidSolution extends Error {
	constructor() {
		super('Solution stored is invalid')
	}
}
class InvalidValue extends TypeError {
	constructor({ type, value }: { type: 'note' | 'box value'; value: unknown }) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		super(`"${value}" is invalid for "${type}" type`)
	}
}
class NotInitialized extends Error {
	constructor() {
		super('board not initialized')
	}
}
class OptsNotDefined extends Error {
	constructor() {
		super('opts not defined')
	}
}

export const BoardErrors = { InvalidSolution, InvalidValue, NotInitialized, OptsNotDefined }
