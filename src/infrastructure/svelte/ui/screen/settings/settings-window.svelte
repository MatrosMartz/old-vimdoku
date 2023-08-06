<script lang="ts">
	import { fly } from 'svelte/transition'

	import { SetType, WindowSecondaryKinds } from '~/domain/models'
	import { vimScreenStore } from '$infra/svelte/stores'

	import SettingsForm from './edit/settings-form.svelte'
	import SettingsShowAll from './settings-show.svelte'
	import SettingsTabs from './settings-tabs.svelte'
</script>

{#if $vimScreenStore.secondary?.kind === WindowSecondaryKinds.Sets}
	<section
		transition:fly={{ x: 100 }}
		class="fixed top-[60px] left-0 right-0 mx-auto w-[85vw] h-[calc(100%-6.5rem)] overflow-hidden bg-surface-100-800-token rounded-xl z-20 text-surface-600-300-token"
	>
		<SettingsTabs />
		{#if $vimScreenStore.secondary.setType === SetType.edit}
			<SettingsForm />
		{:else if $vimScreenStore.secondary.setType === SetType.all}
			<SettingsShowAll />
		{:else if $vimScreenStore.secondary.setType === SetType.diff}
			<SettingsShowAll showType="differ" />
		{/if}
	</section>
{/if}
