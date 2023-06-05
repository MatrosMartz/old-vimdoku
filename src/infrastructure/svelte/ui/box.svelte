<script lang="ts">
	import { BoxKinds, Modes } from '~/domain/models'
	import { SudokuService } from '~/domain/services'

	import { modesStore, sudokuStore } from '../stores'

	export let row: number
	export let col: number

	$: box = $sudokuStore[row][col]
	$: value = box.value > 0 ? box.value : ''

	const InputHandler = () => sudokuStore.move({ row, col })

	const KeyHandler = (e: KeyboardEvent) => {
		if (box.selected || box.kind !== BoxKinds.Initial) {
			const insertNum = Number(e.key)
			if (e.code === 'Backspace' || insertNum === 0)
				sudokuStore.write(SudokuService.EMPTY_BOX_VALUE)
			else if (!Number.isNaN(insertNum)) {
				if ($modesStore === Modes.Insert) sudokuStore.write(insertNum)
				else if ($modesStore === Modes.Annotation) sudokuStore.addNote(insertNum)
			}
			sudokuStore.moveUp()
		}
	}
</script>

<button
	data-testid="{row}-{col}"
	class:initial={box.kind === BoxKinds.Initial}
	class:selected={box.selected}
	class="rounded-lg border-2 border-transparent box-border z-10 outline-none father"
	id="{row}-{col}"
	on:click={InputHandler}
	on:keydown={KeyHandler}
>
	<span data-testid="value" class="flex justify-center items-center" hidden={box.notes.length > 0}>
		{value}
	</span>
	<span data-testid="notes" class="grid grid-cols-3 grid-rows-3" hidden={box.notes.length === 0}>
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as note}
			<span data-testid="note-{note}" class="note-{note}" hidden={!box.notes.includes(note)}>
				{note}
			</span>
		{/each}
	</span>
</button>

<style lang="postcss">
	.father {
		width: 2.5rem;
		height: 2.5rem;
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
	.note-1,
	.note-4,
	.note-7 {
		grid-row: 0 1;
	}
	.note-2,
	.note-5,
	.note-8 {
		grid-row: 1 2;
	}
	.note-3,
	.note-6,
	.note-9 {
		grid-row: 2 3;
	}
	.note-1,
	.note-2,
	.note-3 {
		grid-column: 0 1;
	}
	.note-4,
	.note-5,
	.note-6 {
		grid-column: 1 2;
	}
	.note-7,
	.note-8,
	.note-9 {
		grid-column: 2 3;
	}
</style>
