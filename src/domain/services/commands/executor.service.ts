import { executorOptions, type ICmdExecutorService, type IVimScreenService } from '~/domain/models'
import { SettingsService } from '../settings.service'

export class CmdExecutorService implements ICmdExecutorService {
	#preferences: SettingsService
	#vimScreen: IVimScreenService
	constructor({
		preferences,
		vimScreen,
	}: {
		preferences: SettingsService
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
