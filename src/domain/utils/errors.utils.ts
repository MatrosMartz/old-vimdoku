export class PreferenceError extends Error {
	constructor({ kind = 'property' }: { kind?: 'property' | 'value' } = {}) {
		super(kind === 'property' ? 'preference does not exits' : 'value is incorrect')
	}
}

export const boardErrors = {
	NotInitialized: class extends Error {
		constructor() {
			super('board not initialized')
		}
	},
	OptsNotDefined: class extends Error {
		constructor() {
			super('opts not defined')
		}
	},
	InvalidValue: class extends TypeError {
		constructor({ type, value }: { type: 'note' | 'box value'; value: unknown }) {
			super(`"${value}" is invalid for "${type}" type`)
		}
	},
}
