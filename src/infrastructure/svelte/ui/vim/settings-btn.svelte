<script lang="ts">
	import { SplitKinds } from '~/domain/models'
	import { SettingsIcon } from '$infra/assets'
	import { settingsStore, vimScreen, vimScreenStore } from '$infra/svelte/stores'

	function ClickHandler() {
		if (vimScreen.getSplit() === SplitKinds.Sets) vimScreen.removeSplit()
		else vimScreen.setSetsSplit()
	}

	$: isActive = $vimScreenStore.split?.kind === SplitKinds.Sets
</script>

<button class="settings-btn variant-glass-tertiary" on:click={ClickHandler}>
	<span
		class="absolute inset-0 m-auto flex items-center justify-center"
		class:rotate={isActive}
		class:animations={$settingsStore.animations}
	>
		<SettingsIcon />
	</span>
</button>

<style lang="postcss">
	.settings-btn {
		@apply absolute top-0 right-0 mt-2 mr-2  w-[48px] h-[48px] z-50 overflow-hidden hover:brightness-90;
	}

	:global(.dark) .settings-btn {
		@apply hover:brightness-110;
	}

	.animations {
		@apply transition-transform;
	}

	.animations.rotate {
		@apply rotate-90;
	}
</style>
