import type { ICmdHighlightService } from '~/domain/models'
import { commandsPattern } from '~/domain/utils'

export class CmdHighlightService implements ICmdHighlightService {
	#highlighString(input: string) {
		const replaceValue = '<span class="text-primary-500-400-token">$1</span>'

		return input.replace(/(('[^']*'?)|("[^"]*"?))/g, replaceValue)
	}
	#highlightNumber(input: string) {
		const replaceValue = '<span class="text-secondary-400-500-token">$1</span>'

		input = input.replace(/(?<!\w-?)(-?[1-9][\d_]*)\b(?![^<]*<\/span>)/g, replaceValue)
		return input.replace(
			/(?<!\w-?)(-?0((x[a-fA-F\d_]*)|(o?[0-7_]*)|(b[01_]*)))\b(?![^<]*<\/span>)/g,
			replaceValue
		)
	}
	#highlightSpecialChars(input: string) {
		input = input.replace(
			new RegExp(
				`(?<=h(?:elp)? )(?<!<span class=[^>]*['"])(:(${commandsPattern}))$(?![^<]*<\/span>)`
			),
			'<span class="text-secondary-600-300-token">$1</span>'
		)

		const replaceValue = '<span class="text-tertiary-600-300-token">$1</span>'

		input = input.replace(
			/(?<!(?:<span class=[^>]*['"])|(?:^\w*))([=:!?&+\-\^])(?![^<]*<\/span>)/g,
			replaceValue
		)
		return input.replace(/(?<![^\s\t])(no|inv)(?![^<]*<\/span>)/g, replaceValue)
	}
	#highlightCorrectCommand(input: string) {
		return `<span class="text-success-500-400-token">${input}</span>`
	}
	#highlightInCorrectCommand(input: string) {
		return `<span class="text-error-500-400-token font-semibold">${input}</span>`
	}
	#getCommand(input: string) {
		let commandEnd = input.search(/(?<!<span) /)
		commandEnd = commandEnd < 0 ? input.length : commandEnd
		const command = input.trim().slice(0, commandEnd)

		return { command, commandEnd }
	}
	highlighting(input: string) {
		input = this.#highlighString(input)
		input = this.#highlightNumber(input)
		input = this.#highlightSpecialChars(input)

		const { command, commandEnd } = this.#getCommand(input)

		const newCommand = new RegExp(`^(${commandsPattern})$`).test(command)
			? this.#highlightCorrectCommand(command)
			: this.#highlightInCorrectCommand(command)

		return newCommand + input.slice(commandEnd)
	}
}
