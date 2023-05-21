export const enum Modes {
	Annotation = 'annotation',
	Command = 'command',
	Insert = 'insert',
	Normal = 'normal',
}

type KeysModes = `set${keyof typeof Modes}`

export interface ModesServiceSchema extends Record<KeysModes, () => Modes> {}
