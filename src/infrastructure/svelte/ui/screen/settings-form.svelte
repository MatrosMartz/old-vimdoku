<script lang="ts">
	import { settingsForm } from '~/domain/models'
	import { settings } from '$infra/svelte/stores'

	import SettingsCheckbox from './settings-checkbox.svelte'
	import SettingsNumber from './settings-number.svelte'
	import SettingsSelection from './settings-selection.svelte'
	import BtnReset from './btn-reset.svelte'

	let initialSettings = settings.getValue()
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
			{#each settingsEntries as setting (setting.key)}
				{#if setting.type === 'boolean'}
					<SettingsCheckbox key={setting.key} bind:initialSettings />
				{:else if setting.type === 'number'}
					<SettingsNumber key={setting.key} bind:initialSettings />
				{:else if setting.type === 'option'}
					<SettingsSelection key={setting.key} options={setting.options} bind:initialSettings />
				{/if}
			{/each}
		</section>
	{/each}
	<section class="flex items-center justify-center">
		<BtnReset on:click={() => (initialSettings = settings.getValue())} />
	</section>
</form>

<style lang="postcss">
	.form-group:not(:last-of-type) {
		@apply pb-3 mb-3 border-b-2 border-surface-300 dark:border-surface-600;
	}
</style>
