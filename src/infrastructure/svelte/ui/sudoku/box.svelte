<script lang="ts">
	import { BoxKinds, Modes, type BoxSchema } from '~/domain/models'

	import { boardStore, selectionStore, selection, board, modes } from '$infra/svelte/stores'

	export let row: number
	export let col: number

	let boxBtn: HTMLButtonElement
	let box: BoxSchema
	$: if ($boardStore.hasBoard) box = $boardStore.board[row][col]
	$: value = box.value > 0 ? box.value : ''
	$: selected = $selectionStore.col === col && $selectionStore.row === row
	$: if (selected && boxBtn != null) boxBtn.focus()

	const InputHandler = () => selection.moveTo({ row, col })

	const KeyHandler = ({ key }: KeyboardEvent) => {
		if (selected && box.kind !== BoxKinds.Initial) {
			const insertNum = Number(key)
			if (key === 'Backspace') board.erase()
			else if (!Number.isNaN(insertNum)) {
				if (modes.value === Modes.Insert) board.toggleNumber(insertNum)
				else if (modes.value === Modes.Annotation) board.toggleNote(insertNum)
			}

			if (
				key === 'Backspace' ||
				(!Number.isNaN(insertNum) && [Modes.Insert, Modes.Annotation].includes(modes.value))
			)
				selection.moveToNextEmpty(board.getEmptyBoxesPos())
		}
	}
</script>

<button
	data-testid="{row}-{col}"
	class:initial={box.kind === BoxKinds.Initial}
	class:selected
	class="rounded-lg border-2 border-transparent box-border z-10 relative father"
	id="{row}-{col}"
	bind:this={boxBtn}
	on:click={InputHandler}
	on:keydown={KeyHandler}
>
	<span data-testid="value" class="flex justify-center items-center absolute top-0 left-0">
		{value}
	</span>
</button>

<style lang="postcss">
	.father {
		width: 2.5rem;
		height: 2.5rem;
		outline: none;
	}
	.initial {
		@apply text-primary-600 dark:text-primary-300;
	}
	.selected {
		@apply border-primary-300 dark:text-primary-600 motion-safe:animate-[blink_500ms_ease-in-out_infinite_alternate];
	}

	@keyframes blink {
		0% {
			@apply border-primary-300-600-token;
		}
		100% {
			@apply border-transparent;
		}
	}

	.father * {
		width: 100%;
		height: 100%;
	}
</style>
