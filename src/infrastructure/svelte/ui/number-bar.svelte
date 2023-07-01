<script lang="ts">
	import { selectionStore, settingsStore } from '$infra/svelte/stores'

	export let direction: 'col' | 'row'

	$: current = direction === 'row' ? $selectionStore.row : $selectionStore.col
	let [numbers, relativeNumbers] = [false, false]
	$: {
		numbers = $settingsStore.numbers
		relativeNumbers = $settingsStore.relativeNumbers
	}
	const lines = [0, 1, 2, 3, 4, 5, 6, 7, 8]
</script>

<ul class="{direction} flex justify-around items-center">
	{#each lines as line}
		<li
			class="text-primary-600-300-token opacity-30"
			class:current={current === line}
			data-testid="{direction}-{line}"
		>
			{#if current === line && relativeNumbers && !numbers}
				~
			{:else if current !== line && relativeNumbers}
				{Math.abs(current - line)}
			{:else if numbers}
				{line + 1}
			{/if}
		</li>
	{/each}
</ul>

<style lang="postcss">
	.row {
		grid-area: r;
		@apply flex-col;
	}
	.col {
		grid-area: c;
	}
	.current {
		@apply opacity-100;
	}
</style>
