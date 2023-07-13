import {
	executorOptions,
	type IBoardService,
	type ICmdExecutorService,
	type ISettingsService,
	type IVimScreenService,
} from '~/domain/models'

export class CmdExecutorService implements ICmdExecutorService {
	#board: IBoardService
	#settings: ISettingsService
	#vimScreen: IVimScreenService
	constructor({
		board,
		settings,
		vimScreen,
	}: {
		board: IBoardService
		settings: ISettingsService
		vimScreen: IVimScreenService
	}) {
		this.#board = board
		this.#settings = settings
		this.#vimScreen = vimScreen
	}

	exec(input: string) {
		const [cmd, subcommand] = input.trim().split(/\s+/)

		for (const { pattern, subcommandOption } of executorOptions) {
			if (!pattern(cmd)) continue

			for (const { fn, subPattern } of subcommandOption) {
				if (!subPattern(subcommand)) continue

				fn({
					board: this.#board,
					subcommand,
					preferences: this.#settings,
					vimScreen: this.#vimScreen,
				})
				break
			}
			break
		}
	}
}
