<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let initialHidden: boolean

	const dispatch = createEventDispatcher<{ change: null }>()

	function changeHandler() {
		dispatch('change')
	}
</script>

<div class="flex gap-4">
	<label for="show-only-differ">Show Only Differ Settings:</label>
	<input
		class="checkbox-show"
		type="checkbox"
		name="show-only-differ"
		id="show-only-differ"
		checked={initialHidden}
		on:change={changeHandler}
	/>
</div>

<style lang="postcss">
	.checkbox-show {
		@apply appearance-none box-content w-14 h-7 relative rounded-2xl bg-surface-50 border-2 border-surface-400 focus:border-tertiary-200 transition-[background];
	}
	:global(.dark) .checkbox-show {
		@apply bg-surface-900 border-surface-500 focus:border-tertiary-700;
	}
	.checkbox-show:checked {
		@apply bg-surface-400 dark:bg-surface-500;
	}
	.checkbox-show::after {
		content: '';
		@apply absolute w-7 h-7 bg-current rounded-2xl top-0 left-0 translate-x-0 transition-transform;
	}
	.checkbox-show:checked:after {
		@apply translate-x-full;
	}
</style>
