<script>
	import { blur } from 'svelte/transition'
	import { boardStore, settingsStore } from '$infra/svelte/stores'
	import NumberBar from './number-bar.svelte'
	import Board from './board.svelte'

	$: numbersBars = $settingsStore.numbers || $settingsStore.relativeNumbers ? '3ch' : '0'
</script>

{#if $boardStore !== false}
	<section
		in:blur
		class="game bg-surface-100-800-token rounded-lg overflow-hidden gap-4 p-2"
		style:--numbers={numbersBars}
	>
		<NumberBar direction="col" />
		<NumberBar direction="row" />
		<Board />
	</section>
{:else}
	<div
		class="w-[12vmin] h-[12vmin] rounded-full border-surface-100-800-token border-[12px] border-t-tertiary-50 dark:border-t-tertiary-900 animate-spin"
	/>
{/if}

<style lang="postcss">
	.game {
		display: grid;
		grid-template-areas:
			'. c'
			'r b';

		grid-template-columns: var(--numbers) 1fr;
		grid-template-rows: var(--numbers) 1fr;
		transition: all 500ms ease-in-out;
	}
</style>
