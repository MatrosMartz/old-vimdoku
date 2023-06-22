<script lang="ts">
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	import { cmdHighlight, cmdHistory, suggestionsStore } from '../stores/commands.store'

	let currentValue = ''
	let input: HTMLInputElement
	$: highlight = cmdHighlight.highlighting(currentValue)
	$: suggestionsStore.updateSuggestions(currentValue)

	function autocompleteClickHandler({
		currentTarget: btnAutocomplete,
	}: Event & { currentTarget: HTMLButtonElement }) {
		if ('value' in btnAutocomplete.dataset) {
			const newValue = btnAutocomplete.dataset.value!
			input.value = newValue
			currentValue = newValue
			input.focus()
			cmdHistory.updateAutocomplete(newValue)
			if ('selection' in btnAutocomplete.dataset) {
				const newSelection: [number, number] = JSON.parse(btnAutocomplete.dataset.selection!)

				input.setSelectionRange(...newSelection)
			}
		}
	}

	function keyHandler(ev: KeyboardEvent & { currentTarget: HTMLInputElement }) {
		const { key } = ev
		if (key === 'Enter') {
			cmdHistory.push(currentValue)
			currentValue = ''
		}
		if (key === 'ArrowUp') {
			ev.preventDefault()
			cmdHistory.undo()
			currentValue = cmdHistory.getCurrent()
		}
		if (key === 'ArrowDown') {
			cmdHistory.redo()
			currentValue = cmdHistory.getCurrent()
		}
	}

	onMount(() => {
		input.focus()
	})
</script>

<section
	class="absolute inset-0 h-full w-full glass-command backdrop-blur-lg backdrop-opacity-90 z-20 flex flex-col justify-center items-center pb-[60vh]"
	transition:fade
>
	<div class="relative bg-surface-50-900-token command-width rounded-lg">
		<div class="px-2 py-1 flex justify-start">
			<span><span class="text-tertiary-600-300-token">:</span>{@html highlight}</span>
			<input
				class="command-input"
				type="text"
				maxlength="35"
				placeholder="start easy"
				bind:this={input}
				bind:value={currentValue}
				on:keydown={keyHandler}
				on:input={({ currentTarget }) => cmdHistory.updateAutocomplete(currentTarget.value)}
			/>
		</div>
		<ul class="autocomplete-list">
			{#each $suggestionsStore as option (option.id)}
				<li>
					<button
						class="autocomplete-option bg-surface-200-700-token"
						tabindex={0}
						data-value={option.value}
						data-selection={JSON.stringify(option.newSelection)}
						on:click={autocompleteClickHandler}
					>
						<h6 class="command-option">{@html option.command}</h6>
						<span
							class="italic text-tertiary-500-400-token whitespace-nowrap text-ellipsis overflow-hidden"
							>{option.description}</span
						>
					</button>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style lang="postcss">
	.command-width {
		min-width: 35ch;
		width: 75vw;
	}
	.command-input {
		@apply absolute pl-[1ch] bg-transparent text-transparent caret-primary-900 w-full outline-none;
	}
	:global(.dark) .command-input {
		@apply caret-primary-50;
	}
	.autocomplete-list {
		max-width: calc(80vmax + 1ch + 1rem);
		@apply absolute top-[100%] overflow-hidden rounded-b-lg overflow-y-auto max-h-72 text-clip command-width;
	}
	.autocomplete-option {
		@apply flex justify-between px-2 py-1 gap-4 w-full hover:brightness-90 focus:contrast-[1.13] rounded-none transition-[filter] outline-none border-none;
	}
	:global(.dark) .autocomplete-option {
		@apply hover:brightness-110;
	}
	.command-option {
		@apply whitespace-nowrap;
	}
	.command-option :global(span) {
		@apply text-base;
	}

	.glass-command {
		background-color: rgb(var(--color-surface-50) / 0.2);
	}
	:global(.dark) .glass-command {
		background-color: rgb(var(--color-surface-900) / 0.2);
	}
</style>
