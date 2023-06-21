<script lang="ts">
	import { selectionStore } from '../stores'
	import { preferencesStore } from '../stores/preferences.store'

	export let direction: 'vertical' | 'horizontal'

	$: current = direction === 'vertical' ? $selectionStore.col : $selectionStore.row
	let [numbers, relativeNumbers] = [false, false]
	$: {
		numbers = $preferencesStore.numbers
		relativeNumbers = $preferencesStore.relativeNumbers
	}
	const lines = [0, 1, 2, 3, 4, 5, 6, 7, 8]
</script>

<ul class="{direction} flex justify-around items-center">
	{#each lines as line}
		<li class="text-primary-600-300-token opacity-30" class:current={current === line}>
			{#if relativeNumbers && line === current}
				~
			{:else if relativeNumbers && !numbers}
				{Math.abs(line - current)}
			{:else if numbers}
				{line + 1}
			{/if}
		</li>
	{/each}
</ul>

<style lang="postcss">
	.vertical {
		grid-area: v;
	}
	.horizontal {
		grid-area: h;
		@apply flex-col;
	}
	.current {
		@apply opacity-100;
	}
</style>
