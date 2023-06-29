import { readable } from 'svelte/store'

import type { VimScreen } from '~/domain/models'
import { VimScreenService } from '~/domain/services'
import type { Observer } from '~/domain/utils'

export const vimScreen = new VimScreenService()

export const vimScreenStore = readable(vimScreen.getValue(), set => {
	const observer: Observer<VimScreen> = {
		update: value => set(value),
	}
	vimScreen.addObserver(observer)

	return () => vimScreen.removeObserver(observer)
})
