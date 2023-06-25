import { executorOptions, type ICmdExecutorService } from '~/domain/models'
import { PreferencesService } from '../preferences.service'

export class CmdExecutorService implements ICmdExecutorService {
	#preferences: PreferencesService
	constructor({ preferences }: { preferences: PreferencesService }) {
		this.#preferences = preferences
	}

	exec(input: string) {
		const [cmd, subcommand] = input.trim().split(/\s+/)

		for (const { pattern, subcommandOption } of executorOptions) {
			if (!pattern(cmd)) continue

			for (const { fn, subPattern } of subcommandOption) {
				if (!subPattern(subcommand)) continue

				fn({ subcommand, preferences: this.#preferences })
				break
			}
			break
		}
	}
}
