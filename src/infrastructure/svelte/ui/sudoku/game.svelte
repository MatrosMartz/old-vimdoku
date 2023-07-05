<script>
	import { settingsStore } from '$infra/svelte/stores'
	import NumberBar from './number-bar.svelte'
	import Board from './board.svelte'

	$: numbersBars = $settingsStore.numbers || $settingsStore.relativeNumbers ? '3ch' : '0'
</script>

<section
	class="game bg-surface-100-800-token rounded-lg overflow-hidden gap-4 p-2"
	style:--numbers={numbersBars}
>
	<NumberBar direction="col" />
	<NumberBar direction="row" />
	<Board />
</section>

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
