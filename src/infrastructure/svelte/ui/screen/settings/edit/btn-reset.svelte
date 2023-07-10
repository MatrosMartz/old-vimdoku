<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { SettingsService } from '~/domain/services'
	import { settings } from '$infra/svelte/stores'

	const dispatch = createEventDispatcher<{ click: null }>()

	function clickHandler() {
		settings.updateAll(SettingsService.resetAll)
		dispatch('click')
	}
</script>

<button class="btn-reset variant-glass-tertiary" type="button" on:click={clickHandler}>
	Reset All Settings
</button>

<style lang="postcss">
	.btn-reset {
		@apply h-[48px] px-2 py-1 hover:brightness-90 dark:hover:brightness-110;
	}
</style>
