export function noop() {}

export type DeepReadonly<T> = T extends Array<infer U>
	? ReadonlyArray<DeepReadonly<U>>
	: T extends Record<string, unknown>
	? { readonly [K in keyof T]: DeepReadonly<T[K]> }
	: T

type SimpleObject = Record<string, unknown>

const { freeze, keys } = Object
export function deepFreeze<T>(target: T) {
	let newTarget: DeepReadonly<T>
	if (Array.isArray(target)) newTarget = freeze(target.map(deepFreeze)) as DeepReadonly<T>
	else if (target != null && typeof target === 'object') {
		const newObj: SimpleObject = {}
		for (const key of keys(target)) newObj[key] = deepFreeze((target as SimpleObject)[key])

		newTarget = freeze(newObj) as DeepReadonly<T>
	} else newTarget = target as DeepReadonly<T>

	return newTarget
}

export function deepClone<T>(target: T) {
	let newTarget: T

	if (Array.isArray(target)) {
		newTarget = target.map(el => deepClone(el)) as T
	} else if (target != null && typeof target === 'object') {
		const newObj: SimpleObject = {}
		for (const key of keys(target)) newObj[key] = deepClone((target as SimpleObject)[key])
		newTarget = newObj as T
	} else newTarget = target

	return newTarget
}
