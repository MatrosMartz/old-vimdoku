<script lang="ts">
	import { settingsStore } from '$infra/svelte/stores'
	import {
		sudokuSettingsKeys,
		type Settings,
		type SudokuSettings,
		type UserSettings,
		type VimSettings,
		userSettingsKeys,
		vimSettingsKeys,
		defaultSettings,
	} from '~/domain/models'
	import { normalCase } from '~/domain/utils'

	export let showType: 'all' | 'differ' = 'all'

	type SettingsEntries<K extends keyof Settings = keyof Settings> = [K, Settings[K]][]

	const initialGroups = [
		{ group: 'Sudoku', entries: [] as [string, unknown][] },
		{ group: 'User', entries: [] as [string, unknown][] },
		{ group: 'Vim', entries: [] as [string, unknown][] },
	]
	$: groupSettings = Object.entries($settingsStore).reduce((acc, cur) => {
		const canPush = showType === 'all' || defaultSettings[cur[0] as keyof Settings] === cur[1]
		if (canPush) {
			if (sudokuSettingsKeys.includes(cur[0])) acc[0].entries.push(cur)
			else if (userSettingsKeys.includes(cur[0])) acc[1].entries.push(cur)
			else if (vimSettingsKeys.includes(cur[0])) acc[2].entries.push(cur)
		}
		return acc
	}, initialGroups) as [
		{ group: 'Sudoku'; entries: SettingsEntries<keyof SudokuSettings> },
		{ group: 'User'; entries: SettingsEntries<keyof UserSettings> },
		{ group: 'Vim'; entries: SettingsEntries<keyof VimSettings> }
	]

	const valueClass = (value: number | boolean | string) =>
		typeof value === 'number'
			? 'text-secondary-500-400-token'
			: typeof value === 'boolean'
			? 'text-warning-200-700-token italic'
			: 'text-primary-500-400-token'
</script>

<section class="h-[calc(100%-4rem)] overflow-y-auto px-6 py-4" data-testid="settings-show">
	{#each groupSettings as { group, entries } (group)}
		<section class="setting-group inline-block w-max">
			<h6 class="sm:col-span-2 lg:col-span-3 unstyled font-semibold leading-8">{group} Settings</h6>
			<ul class="flex flex-col gap-2">
				{#each entries as [key, value] (key)}
					<li class="flex justify-between w-[40ch] mx-auto">
						<strong>{normalCase(key)}:</strong>
						<span class={valueClass(value)}>
							{typeof value === 'string' ? `"${value}"` : value}
						</span>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</section>

<style lang="postcss">
	.setting-group:not(:last-of-type) {
		@apply pb-4 mb-4 border-b-2 border-surface-300 dark:border-surface-600;
	}
</style>
