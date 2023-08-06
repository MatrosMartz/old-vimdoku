<script lang="ts">
	import { settingsForm } from '~/domain/models'
	import { settings } from '$infra/svelte/stores'

	import BtnReset from './btn-reset.svelte'
	import SettingsCheckbox from './settings-checkbox.svelte'
	import SettingsNumber from './settings-number.svelte'
	import SettingsSelection from './settings-selection.svelte'

	let initialSettings = settings.value
</script>

<form action="" class="h-[calc(100%-4rem)] overflow-y-auto px-6 py-4" data-testid="settings-form">
	{#each settingsForm as [group, settingsEntries] (group)}
		<section class="grid grid-cols-1 gap-y-3 gap-x-12 max-w-[60ch] form-group mx-auto">
			<h6 class="unstyled font-semibold leading-8">
				{group} Settings
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
	<section class="flex items-center justify-center gap-12">
		<BtnReset on:click={() => (initialSettings = settings.value)} />
	</section>
</form>

<style lang="postcss">
	.form-group {
		@apply pb-4 mb-4 border-b-2 border-surface-300 dark:border-surface-600;
	}
</style>
