<script lang="ts">
	import { Difficulties, difficultiesKeys } from '~/domain/models'
	import { board, vimScreen } from '$infra/svelte/stores'

	let difficultySelected: Difficulties = Difficulties.Easy

	function submitHandler() {
		vimScreen.setGameWindow()
		board.initBoard({ difficulty: difficultySelected })
	}
</script>

<form action="" on:submit|preventDefault={submitHandler}>
	<label for="select-difficulty">Select Difficulty</label>
	<select
		class="select-difficulty"
		name="select-difficulty"
		id="select-difficulty"
		bind:value={difficultySelected}
	>
		{#each difficultiesKeys as [key, value] (value)}
			<option {value}>{key}</option>
		{/each}
	</select>
	<div class="mt-2">
		<button class="btn-start variant-glass-tertiary">Start game</button>
	</div>
</form>

<style lang="postcss">
	.btn-start {
		@apply h-[48px] px-2 py-1 hover:brightness-90 dark:hover:brightness-110;
	}

	.select-difficulty {
		@apply box-content w-28 px-2 h-7 relative rounded-lg bg-surface-50 border-2 border-surface-400 outline-none focus:border-tertiary-200;
	}
	:global(.dark) .select-difficulty {
		@apply bg-surface-900 border-surface-500 focus:border-tertiary-700;
	}
</style>
