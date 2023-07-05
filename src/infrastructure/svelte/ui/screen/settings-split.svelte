<script>
	import { SplitKinds } from '~/domain/models'
	import { vimScreenStore } from '$infra/svelte/stores'

	import SettingsForm from './settings-form.svelte'
</script>

{#if $vimScreenStore.split?.kind === SplitKinds.Sets}
	<SettingsForm />
{/if}
