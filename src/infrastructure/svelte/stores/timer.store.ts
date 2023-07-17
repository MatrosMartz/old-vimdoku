import { derived } from 'svelte/store'

import { TimerService } from '~/domain/services'

import { storeFromObservable } from './utils'

export const timer = new TimerService()

export const timerStore = storeFromObservable(timer)
export const formattedTimer = derived(timerStore, ({ seconds }) => TimerService.formatter(seconds))
