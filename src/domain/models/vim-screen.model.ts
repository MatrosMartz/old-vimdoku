import type { Observable } from '../utils'

export enum WindowKinds {
	Game = 'game',
	Init = 'initial',
}
export enum SplitKinds {
	Help = 'help',
	Sets = 'settings',
}

export type SplitPosition = 'left' | 'right' | 'top' | 'bottom' | 'full'

export interface WindowSplit {
	kind: SplitKinds
	position: SplitPosition
}

export interface VimScreen {
	window: WindowKinds
	split?: WindowSplit
}

export const defaultScreen: VimScreen = { window: WindowKinds.Init }

export interface IVimScreenService extends Observable<VimScreen> {
	getSplit: () => SplitKinds | undefined
	removeSplit: () => void
	setHelpSplit: (position?: SplitPosition) => void
	setSetsSplit: (position?: SplitPosition) => void
	setWindow: (newWindow: WindowKinds) => void
	undo: () => void
}
