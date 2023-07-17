import { ModesService } from '~/domain/services'

import { storeFromObservable } from './utils'

export const modes = new ModesService()

export const modesStore = storeFromObservable(modes)
