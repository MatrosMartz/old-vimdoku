export class PreferenceError extends Error {
	constructor({ kind = 'property' }: { kind?: 'property' | 'value' } = {}) {
		super(kind === 'property' ? 'preference does not exits' : 'value is incorrect')
	}
}

export namespace BoardErrors {
	export class InvalidValue extends TypeError {
		constructor({ type, value }: { type: 'note' | 'box value'; value: unknown }) {
			super(`"${value}" is invalid for "${type}" type`)
		}
	}
	export class InvalidSolution extends Error {
		constructor() {
			super('Solution stored is invalid')
		}
	}
	export class NotInitialized extends Error {
		constructor() {
			super('board not initialized')
		}
	}
	export class OptsNotDefined extends Error {
		constructor() {
			super('opts not defined')
		}
	}
}
