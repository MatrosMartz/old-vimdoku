<script lang="ts">
	import { BoxKinds } from '~/domain/models'
	import { SudokuService } from '~/domain/services'

	import { sudokuStore } from '../stores'

	export let row: number
	export let col: number

	$: box = $sudokuStore[row][col]
	$: value = box.value > 0 ? box.value : ''

	const InputHandler = () => sudokuStore.move({ row, col })

	const KeyHandler = (e: KeyboardEvent) => {
		if (box.selected || box.kind !== BoxKinds.Initial) {
			const insertNum = Number(e.key)
			if (!Number.isNaN(insertNum)) sudokuStore.write(insertNum)
			if (e.code === 'Backspace') sudokuStore.write(SudokuService.EMPTY_BOX_VALUE)
			sudokuStore.moveUp()
		}
	}
</script>

<button
	data-testid="{row}-{col}"
	class:initial={box.kind === BoxKinds.Initial}
	class:selected={box.selected}
	class="rounded-lg border-2 border-transparent box-border father"
	id="{row}-{col}"
	on:click={InputHandler}
	on:keydown={KeyHandler}
>
	<span class="flex justify-center items-center">
		{value}
	</span>
</button>

<style lang="postcss">
	.father {
		width: 2.5rem;
		height: 2.5rem;
		border-color: transparent;
		z-index: 9;
		outline: none;
	}
	.initial {
		color: rgb(var(--color-primary-600));
	}
	:global(.dark) .initial {
		color: rgb(var(--color-primary-300));
	}
	.selected {
		--border-color: var(--color-primary-300);
		border-color: rgb(var(--border-color));
		animation: blink 500ms ease-in-out infinite alternate;
	}
	:global(.dark) .selected {
		--border-color: var(--color-primary-600);
	}

	@keyframes blink {
		0% {
			border-color: rgb(var(--border-color));
		}
		100% {
			border-color: transparent;
		}
	}

	.father * {
		width: 100%;
		height: 100%;
	}
</style>
