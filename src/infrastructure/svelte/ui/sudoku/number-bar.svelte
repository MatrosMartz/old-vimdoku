<script lang="ts">
	import { fly } from 'svelte/transition'

	import { selectionStore, settingsStore } from '$infra/svelte/stores'

	export let direction: 'col' | 'row'

	const isRow = direction === 'row'
	const flyParams = isRow ? { x: 10 } : { y: 10 }

	$: current = isRow ? $selectionStore.row : $selectionStore.col
	$: ({ numbers, relativeNumbers } = $settingsStore)
	const lines = [0, 1, 2, 3, 4, 5, 6, 7, 8]
</script>

<ul
	transition:fly={{ duration: 1_000, ...flyParams }}
	class="absolute {direction} flex justify-around items-center rounded-lg bg-surface-100-800-token brightness-[107%] dark:brightness-[93%]"
>
	{#each lines as line}
		<li
			class="text-primary-600-300-token opacity-30"
			class:current={current === line}
			data-testid="{direction}-{line}"
		>
			{#if current === line && relativeNumbers}
				~
			{:else if current !== line && relativeNumbers && !numbers}
				{Math.abs(current - line)}
			{:else if numbers}
				{line + 1}
			{/if}
		</li>
	{/each}
</ul>

<style lang="postcss">
	.row {
		@apply flex-col h-full w-[4ch] py-2 top-0 right-full rounded-r-none;
	}
	.col {
		@apply w-full h-[4ch] px-2 left-0 bottom-full rounded-b-none;
	}
	.current {
		@apply opacity-100;
	}
</style>
