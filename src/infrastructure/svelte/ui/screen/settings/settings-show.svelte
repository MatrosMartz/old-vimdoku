<script lang="ts">
	import {
		defaultSettings,
		type Settings,
		type SudokuSettings,
		sudokuSettingsKeys,
		type UserSettings,
		userSettingsKeys,
		type VimSettings,
		vimSettingsKeys,
	} from '~/domain/models'
	import { normalCase } from '~/domain/utils'
	import { settingsStore } from '$infra/svelte/stores'

	export let showType: 'all' | 'differ' = 'all'

	type Groups<Sudoku, User, Vim> = [
		{ entries: Sudoku; group: 'Sudoku' },
		{ entries: User; group: 'User' },
		{ entries: Vim; group: 'Vim' }
	]

	type SettingsEntries<K extends keyof Settings = keyof Settings> = Array<[K, Settings[K]]>
	type GroupSettings = Groups<
		SettingsEntries<keyof SudokuSettings>,
		SettingsEntries<keyof UserSettings>,
		SettingsEntries<keyof VimSettings>
	>

	const initialGroups: Groups<
		Array<[string, unknown]>,
		Array<[string, unknown]>,
		Array<[string, unknown]>
	> = [
		{ group: 'Sudoku', entries: [] },
		{ group: 'User', entries: [] },
		{ group: 'Vim', entries: [] },
	]
	$: groupSettings = Object.entries($settingsStore).reduce((acc, cur) => {
		const canPush = showType === 'all' || defaultSettings[cur[0] as keyof Settings] === cur[1]
		if (canPush) {
			if (sudokuSettingsKeys.includes(cur[0])) acc[0].entries.push(cur)
			else if (userSettingsKeys.includes(cur[0])) acc[1].entries.push(cur)
			else if (vimSettingsKeys.includes(cur[0])) acc[2].entries.push(cur)
		}
		return acc
	}, initialGroups) as GroupSettings

	const valueClass = (value: number | boolean | string) =>
		typeof value === 'number'
			? 'text-secondary-500-400-token'
			: typeof value === 'boolean'
			? 'text-warning-200-700-token italic'
			: 'text-primary-500-400-token'
</script>

<section class="h-[calc(100%-4rem)] overflow-y-auto px-6 py-4" data-testid="settings-show">
	{#each groupSettings as { group, entries } (group)}
		<section class="setting-group max-w-[60ch] mx-auto">
			<h6 class="unstyled font-semibold leading-8">{group} Settings</h6>
			<ul class="flex flex-col gap-2">
				{#each entries as [key, value] (key)}
					<li class="flex justify-between w-full mx-auto">
						<strong>{normalCase(key)}:</strong>
						<span class={valueClass(value)}>
							{typeof value === 'string' ? `"${String(value)}"` : value}
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
