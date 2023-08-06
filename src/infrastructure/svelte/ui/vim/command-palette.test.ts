import { cleanup, render } from '@testing-library/svelte'
import { afterEach, describe, expect, test } from 'vitest'

import CommandPalette from './command-palette.svelte'

afterEach(() => {
	cleanup()
})

describe('Command Palette', () => {
	test('should be render', () => {
		render(CommandPalette)

		expect(true).toBe(true)
	})
})
