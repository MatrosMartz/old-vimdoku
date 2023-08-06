import { getKeysByType } from '~/domain/utils'

import { Modes } from '../modes.model'
import { defaultSettings } from '../settings.model'
import { Difficulties } from '../sudoku'

export interface ModeKey {
	letter: string
	mode: Modes
}

export const { numberKeys, stringKeys, toggleKeys } = getKeysByType(defaultSettings)
export const allPreferencesKeys = [...numberKeys, ...stringKeys, ...toggleKeys]
export const nonToggleKeys = [...numberKeys, ...stringKeys]
export const modesKeys: ModeKey[] = [
	{ mode: Modes.Annotation, letter: 'n' },
	{ mode: Modes.Command, letter: 'c' },
	{ mode: Modes.Insert, letter: 'i' },
	{ mode: Modes.Normal, letter: 'x' },
]
export const difficultiesKeys = Object.entries(Difficulties).filter(([key]) =>
	Number.isNaN(Number(key))
) as Array<[keyof typeof Difficulties, Difficulties]>
export const commandsKeys = [
	'continue',
	'exit',
	'help',
	'pause',
	'quit!',
	'quit',
	'reset',
	'set',
	'start',
	'wquit',
	'write',
	'xit',
]
