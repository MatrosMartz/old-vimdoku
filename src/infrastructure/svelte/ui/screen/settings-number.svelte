<script lang="ts">
	import { defaultSettings, type NumberKeys, type Settings } from '~/domain/models'
	import { normalCase } from '~/domain/utils'
	import { settings } from '$infra/svelte/stores'

	export let key: NumberKeys
	export let initialSettings: Settings = defaultSettings
	let input: HTMLInputElement

	const value = initialSettings[key]

	$: if (input != null) {
		input.value = String(initialSettings[key])
	}

	let timerID: ReturnType<typeof setTimeout>

	function InputHandler({ currentTarget }: Event & { currentTarget: HTMLInputElement }) {
		const newValue = Number(currentTarget.value)
		if (timerID != null) clearTimeout(timerID)
		timerID = setTimeout(() => settings.updateByKey(key, () => newValue), 500)
	}
</script>

<div class="flex justify-between">
	<label class="text-ellipsis text-start" for="{key}-number">{normalCase(key)}:</label>
	<input
		class="settings-number"
		type="number"
		name="{key}-number"
		id="{key}-number"
		{value}
		on:input={InputHandler}
		bind:this={input}
	/>
</div>

<style lang="postcss">
	.settings-number {
		@apply appearance-none box-content w-28 px-2 h-7 relative rounded-lg bg-surface-50 border-2 border-surface-400 outline-none focus:border-tertiary-200;
	}
	:global(.dark) .settings-number {
		@apply bg-surface-900 border-surface-500 focus:border-tertiary-700;
	}
</style>
