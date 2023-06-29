import type { Observable } from '../utils'

export enum WindowKinds {
	Game = 'game',
	Init = 'initial',
}
export enum SplitKinds {
	Help = 'help',
	Opts = 'options',
}

export interface WindowSplit<T extends SplitKinds = SplitKinds> {
	kind: T
	position: 'left' | 'right' | 'top' | 'bottom' | 'full'
}

export interface VimScreen {
	window: WindowKinds
	split?: WindowSplit
}

export const defaultScreen: VimScreen = { window: WindowKinds.Init }

export interface IVimScreenService extends Observable<VimScreen> {
	setWindow: (newWindow: WindowKinds) => void
	addSplit: (newSplit: WindowSplit) => void
	undo: () => void
}
