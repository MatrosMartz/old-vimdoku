import { allPreferencesKeys, nonToggleKeys, toggleKeys } from './commands.model'

export const allPreferences = allPreferencesKeys.map(({ preference }) => preference)
export const togglePreferences = toggleKeys.map(({ preference }) => preference)
export const nonTogglePreferences = nonToggleKeys.map(({ preference }) => preference)

export interface ICmdExecutorService {
	exec: (input: string) => void
}
