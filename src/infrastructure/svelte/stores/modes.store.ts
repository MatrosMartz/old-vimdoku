import { readable } from 'svelte/store'

import type { Modes } from '~/domain/models'
import { ModesService } from '~/domain/services'
import type { Observer } from '~/domain/utils'

export const modes = new ModesService()

export const modesStore = readable(modes.getValue(), set => {
	const observer: Observer<Modes> = {
		update: value => set(value),
	}
	modes.addObserver(observer)

	return () => modes.removeObserver(observer)
})
