import { getKeysByType } from '~/domain/utils'
import { Modes } from '../modes.model'
import { defaultPreferences } from '../preferences.model'
import { Difficulties } from '../sudoku.model'

export const { numberKeys, stringKeys, toggleKeys } = getKeysByType(defaultPreferences)
export const allPreferencesKeys = [...numberKeys, ...stringKeys, ...toggleKeys]
export const nonToggleKeys = [...numberKeys, ...stringKeys]
export const modesKeys: Array<{ mode: Modes; letter: string }> = [
	{ mode: Modes.Annotation, letter: 'n' },
	{ mode: Modes.Command, letter: 'c' },
	{ mode: Modes.Insert, letter: 'i' },
	{ mode: Modes.Normal, letter: 'x' },
]
export const difficultiesKeys = Object.entries(Difficulties).filter(([key]) =>
	Number.isNaN(Number(key))
) as [keyof typeof Difficulties, Difficulties][]
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
