export class PreferenceError extends Error {
	constructor({ kind = 'property' }: { kind?: 'property' | 'value' } = {}) {
		super(kind === 'property' ? 'preference does not exits' : 'value is incorrect')
	}
}
