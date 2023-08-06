export interface ICmdHistoryService {
	readonly value: readonly string[]
	add(cmd: string): void
	clear(): void
}

export interface ICmdAutocompleteService {
	readonly value: string
	getCmdAutocomplete(): readonly string[]
	push(cmd: string): void
	redo(): void
	search(input?: string): void
	undo(): void
}
