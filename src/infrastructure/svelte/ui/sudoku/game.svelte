<script>
	import { boardStore, settingsStore } from '$infra/svelte/stores'

	import Board from './board.svelte'
	import NumberBar from './number-bar.svelte'

	$: hasBars = Boolean($settingsStore.relativeNumbers) || $settingsStore.numbers
</script>

{#if $boardStore.hasBoard}
	<section
		class="relative bg-surface-100-800-token rounded-lg gap-0 p-2 transition-[border-radius]"
		class:has-bars={hasBars}
	>
		{#if hasBars}
			<NumberBar direction="col" />
			<NumberBar direction="row" />
		{/if}
		<Board />
	</section>
{:else}
	<div
		class="w-[12vmin] h-[12vmin] rounded-full border-surface-100-800-token border-[12px] border-t-tertiary-50 dark:border-t-tertiary-900 animate-spin"
	/>
{/if}

<style lang="postcss">
	.has-bars {
		@apply rounded-t-none rounded-l-none;
	}
</style>
