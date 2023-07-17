import { VimScreenService } from '~/domain/services'

import { storeFromObservable } from './utils'

export const vimScreen = new VimScreenService()

export const vimScreenStore = storeFromObservable(vimScreen)
