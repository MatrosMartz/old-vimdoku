import type { Observable } from '../utils'

export enum Modes {
	Annotation = 'annotation',
	Command = 'command',
	Insert = 'insert',
	Normal = 'normal',
}

type KeysModes = `set${keyof typeof Modes}`

export interface IModesService extends Record<KeysModes, () => void>, Observable<Modes> {}
