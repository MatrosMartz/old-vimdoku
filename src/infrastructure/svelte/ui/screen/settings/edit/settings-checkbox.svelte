<script lang="ts">
	import type { Settings, ToggleKeys } from '~/domain/models'
	import { SettingsService } from '~/domain/services'
	import { normalCase } from '~/domain/utils'
	import { settings } from '$infra/svelte/stores'

	export let key: ToggleKeys
	export let initialSettings: Settings
	let input: HTMLInputElement

	const checked = initialSettings[key]

	$: if (input != null) input.checked = initialSettings[key]

	function changeHandler() {
		settings.updateByKey(key, SettingsService.toggle)
	}
</script>

<div class="flex justify-between">
	<label class="text-ellipsis text-start" for="{key}-checkbox">{normalCase(key)}:</label>
	<input
		class="settings-checkbox"
		type="checkbox"
		name="{key}-checkbox"
		id="{key}-checkbox"
		{checked}
		on:input={changeHandler}
		bind:this={input}
	/>
</div>

<style lang="postcss">
	.settings-checkbox {
		@apply appearance-none box-content w-14 h-7 relative rounded-2xl bg-surface-50 border-2 border-surface-400 focus:border-tertiary-200 transition-[background];
	}
	:global(.dark) .settings-checkbox {
		@apply bg-surface-900 border-surface-500 focus:border-tertiary-700;
	}
	.settings-checkbox:checked {
		@apply bg-surface-400 dark:bg-surface-500;
	}
	.settings-checkbox::after {
		content: '';
		@apply absolute w-7 h-7 bg-current rounded-2xl top-0 left-0 translate-x-0 transition-transform;
	}
	.settings-checkbox:checked:after {
		@apply translate-x-full;
	}
</style>
