<script>
	import { preferencesStore } from '../stores/preferences.store'
	import NumberBar from './number-bar.svelte'
	import SudokuBoard from './sudoku-board.svelte'

	$: numbersBars = $preferencesStore.numbers || $preferencesStore.relativeNumbers ? '3ch' : '0'
</script>

<section
	class="game bg-surface-100-800-token rounded-lg overflow-hidden gap-4 p-2"
	style:--numbers={numbersBars}
>
	<NumberBar direction="horizontal" />
	<NumberBar direction="vertical" />
	<SudokuBoard />
</section>

<style lang="postcss">
	.game {
		display: grid;
		grid-template-areas:
			'. h'
			'v b';

		grid-template-columns: var(--numbers) 1fr;
		grid-template-rows: var(--numbers) 1fr;
		transition: all 500ms ease-in-out;
	}
</style>
