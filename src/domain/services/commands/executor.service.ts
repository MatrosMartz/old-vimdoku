import { executorOptions, type ICmdExecutorService, type IVimScreenService } from '~/domain/models'
import { PreferencesService } from '../preferences.service'

export class CmdExecutorService implements ICmdExecutorService {
	#preferences: PreferencesService
	#vimScreen: IVimScreenService
	constructor({
		preferences,
		vimScreen,
	}: {
		preferences: PreferencesService
		vimScreen: IVimScreenService
	}) {
		this.#preferences = preferences
		this.#vimScreen = vimScreen
	}

	exec(input: string) {
		const [cmd, subcommand] = input.trim().split(/\s+/)

		for (const { pattern, subcommandOption } of executorOptions) {
			if (!pattern(cmd)) continue

			for (const { fn, subPattern } of subcommandOption) {
				if (!subPattern(subcommand)) continue

				fn({ subcommand, preferences: this.#preferences, vimScreen: this.#vimScreen })
				break
			}
			break
		}
	}
}
