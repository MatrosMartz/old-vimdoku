import type { Observable } from '~/domain/utils'

export enum WindowPrimaryKinds {
	Game = 'game',
	Init = 'initial',
}
export enum WindowSecondaryKinds {
	Help = 'help',
	Sets = 'settings',
}

export enum SetType {
	all = 'all',
	diff = 'differ',
	edit = 'edit',
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HelpWindowOpts {}
export interface SetsWindowOpts {
	setType: SetType
}

export type WindowSecondaryOpts =
	| ({ kind: WindowSecondaryKinds.Help } & HelpWindowOpts)
	| ({ kind: WindowSecondaryKinds.Sets } & SetsWindowOpts)

export interface WindowSecondaryOptsAll extends HelpWindowOpts, SetsWindowOpts {
	kind: WindowSecondaryKinds
}

export interface VimScreen {
	secondary?: WindowSecondaryOpts
	primary: WindowPrimaryKinds
}

export const defaultScreen: VimScreen = { primary: WindowPrimaryKinds.Init }

export interface IVimScreenService extends Observable<VimScreen> {
	getOptForKey<K extends keyof WindowSecondaryOptsAll>(key: K): WindowSecondaryOptsAll[K]
	removeSecondary(): void
	setGameWindow(): void
	setHelpSecondary(opts?: Partial<HelpWindowOpts>): void
	setInitWindow(): void
	setSetsSecondary(opts?: Partial<SetsWindowOpts>): void
	undo(): void
}
