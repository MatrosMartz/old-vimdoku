<script lang="ts">
	import { selectionStore } from '$infra/svelte/stores'

	import Box from './box.svelte'
</script>

<div class="board text-secondary-500-400-token">
	<section>
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as _, row}
			{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as _, col}
				<Box {row} {col} />
			{/each}
		{/each}
		<span class="separator row row-1" />
		<span class="separator row row-2" />
		<span class="separator col col-1" />
		<span class="separator col col-2" />
		<span class="line-highlight row" style:--row={$selectionStore.row} />
		<span class="line-highlight col" style:--col={$selectionStore.col} />
	</section>
</div>

<style lang="postcss">
	section {
		position: relative;
		display: grid;
		grid-template-columns: repeat(9, 1fr);
	}
	.board {
		grid-area: b;
	}
	.separator {
		--x: 100%;
		--y: 3px;
		inset: 0;
		position: absolute;
		display: block;
		border-radius: 2px;
		background-color: rgb(var(--color-tertiary-50));
	}
	:global(.dark) .separator {
		background-color: rgb(var(--color-tertiary-900));
	}
	.separator.row {
		height: var(--x);
		width: var(--y);
		margin-block: auto;
	}
	.separator.row-1 {
		left: calc(100% / 3);
		transform: translateX(calc(100% / 3));
	}
	.separator.row-2 {
		left: calc(100% / 1.5);
		transform: translateX(calc(-100% / 0.75));
	}
	.separator.col {
		width: var(--x);
		height: var(--y);
		margin-inline: auto;
	}
	.separator.col-1 {
		top: calc(100% / 3);
		transform: translateY(calc(100% / 3));
	}
	.separator.col-2 {
		top: calc(100% / 1.5);
		transform: translateY(calc(-100% / 0.75));
	}

	.line-highlight {
		--x: 100%;
		--y: 2.5rem;
		top: 0;
		left: 0;
		position: absolute;
		display: block;
		z-index: 0;
		background-color: rgb(var(--color-tertiary-50));
		filter: opacity(40%);
		@apply rounded-lg;
	}
	:global(.dark) .line-highlight {
		background-color: rgb(var(--color-tertiary-900));
	}
	.line-highlight.col {
		height: var(--x);
		width: var(--y);
		transform: translateX(calc(100% * var(--col)));
		transition: transform 100ms;
	}
	.line-highlight.row {
		width: var(--x);
		height: var(--y);
		transform: translateY(calc(100% * var(--row)));
		transition: transform 100ms;
	}
</style>
