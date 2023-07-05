<script lang="ts">
	import { settingsForm } from '~/domain/models'
	import { settings } from '../../stores'
	import SettingsCheckbox from './settings-checkbox.svelte'
	import SettingsNumber from './settings-number.svelte'
	import SettingsSelection from './settings-selection.svelte'
	import { SettingsService } from '~/domain/services'

	let initialSettings = settings.getValue()

	function clickHandler() {
		settings.updateAll(SettingsService.resetAll)

		initialSettings = settings.getValue()
	}
</script>

<form
	action=""
	class="fixed top-[60px] left-0 right-0 mx-auto w-[85vw] h-[calc(100%-100px)] overflow-y-auto bg-surface-100-800-token rounded-xl z-20 px-4 py-8 text-surface-600-300-token"
>
	{#each settingsForm as [group, settingsEntries] (group)}
		<section class="grid grid-cols-4 gap-2 w-full form-group">
			<h6 class="col-span-4 unstyled font-semibold">
				{group}
			</h6>
			{#each settingsEntries as [key, value] (key)}
				{#if value.type === 'boolean'}
					<SettingsCheckbox {key} bind:initialSettings />
				{:else if value.type === 'number'}
					<SettingsNumber {key} bind:initialSettings />
				{:else if value.type === 'option'}
					<SettingsSelection {key} bind:initialSettings options={value.enum} />
				{/if}
			{/each}
		</section>
	{/each}
	<section class="flex items-center justify-center">
		<button class="btn-reset variant-glass-tertiary" type="button" on:click={clickHandler}
			>reset settings</button
		>
	</section>
</form>

<style lang="postcss">
	.form-group:not(:last-of-type) {
		@apply pb-3 mb-3 border-b-2 border-surface-300 dark:border-surface-600;
	}
	.btn-reset {
		@apply h-[48px] px-2 py-1 hover:brightness-90 dark:hover:brightness-110;
	}
</style>
