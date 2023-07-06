<script lang="ts">
	import { type Settings, type StringKeys } from '~/domain/models'
	import { settings } from '$infra/svelte/stores'
	import { normalCase } from '~/domain/utils'

	export let key: StringKeys
	export let initialSettings: Settings
	export let options: Settings[typeof key][]
	let select: HTMLSelectElement

	const value = initialSettings[key]

	$: if (select != null) {
		select.value = initialSettings[key]
	}

	let timerID: ReturnType<typeof setTimeout>

	function ChangeHandler({ currentTarget }: Event & { currentTarget: HTMLSelectElement }) {
		const newValue = currentTarget.value as typeof value
		if (timerID != null) clearTimeout(timerID)
		timerID = setTimeout(() => settings.updateByKey(key, () => newValue), 500)
	}
</script>

<div class="flex justify-between">
	<label class="text-ellipsis text-start" for="{key}-option">{normalCase(key)}:</label>
	<select
		class="settings-selection"
		name="{key}-option"
		id="{key}-option"
		{value}
		on:change={ChangeHandler}
		bind:this={select}
	>
		{#each options as opt (opt)}
			<option class="bg-surface-100-800-token rounded-lg active:brightness-105" value={opt}
				>{opt}</option
			>
		{/each}
	</select>
</div>

<style lang="postcss">
	.settings-selection {
		@apply box-content w-28 px-2 h-7 relative rounded-lg bg-surface-50 border-2 border-surface-400 outline-none focus:border-tertiary-200;
	}
	:global(.dark) .settings-selection {
		@apply bg-surface-900 border-surface-500 focus:border-tertiary-700;
	}
</style>
