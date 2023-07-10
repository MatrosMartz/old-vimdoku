<script lang="ts">
	import { SetType } from '~/domain/models'
	import { vimScreen } from '$infra/svelte/stores'

	export let initialSelected: SetType = SetType.edit

	const Messages: Record<SetType, String> = {
		all: 'Show All',
		differ: 'Show Only Differ',
		edit: 'Edit',
	}
</script>

<fieldset class=" flex gap-6 justify-center pt-4">
	{#each Object.values(SetType) as setTab (setTab)}
		<input
			type="radio"
			name="settings-tab"
			id={setTab}
			value={setTab}
			checked={initialSelected === setTab}
			on:click={() => vimScreen.setSetsSecondary({ setType: setTab })}
			class="hidden"
		/>
		<label for={setTab} class="bg-surface-200-700-token text-black dark:text-white"
			>{Messages[setTab]}</label
		>
	{/each}
</fieldset>

<style lang="postcss">
	label {
		@apply p-3 rounded-xl transition-[filter];
	}
	input:checked + label {
		@apply brightness-75 dark:brightness-125;
	}
</style>
