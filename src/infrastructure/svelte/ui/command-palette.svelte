<script lang="ts">
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	import { CommandsSuggestionService } from '~/domain/services'
	import { history } from '../stores/commands.store'

	const commandsSuggestion = new CommandsSuggestionService()

	let currentValue = ''
	let input: HTMLInputElement
	$: highlight = commandsSuggestion.highlighting(currentValue)
	$: suggestionsOptions = commandsSuggestion.getSuggestions(currentValue)

	function autocompleteClickHandler({
		currentTarget: btnAutocomplete,
	}: Event & { currentTarget: HTMLButtonElement }) {
		if ('value' in btnAutocomplete.dataset) {
			const newValue = btnAutocomplete.dataset.value!
			input.value = newValue
			currentValue = newValue
			input.focus()
			history.updateAutocomplete(newValue)
			if ('selection' in btnAutocomplete.dataset) {
				const newSelection: [number, number] = JSON.parse(btnAutocomplete.dataset.selection!)

				input.setSelectionRange(...newSelection)
			}
		}
	}

	function keyHandler(ev: KeyboardEvent & { currentTarget: HTMLInputElement }) {
		const { key } = ev
		if (key === 'Enter') {
			history.push(currentValue)
			currentValue = ''
		}
		if (key === 'ArrowUp') {
			ev.preventDefault()
			history.undo()
			currentValue = history.getCurrent()
		}
		if (key === 'ArrowDown') {
			history.redo()
			currentValue = history.getCurrent()
		}
	}

	onMount(() => {
		input.focus()
	})
</script>

<section
	class="absolute inset-0 h-full w-full badge-glass z-50 flex flex-col justify-center items-center pb-[60vh]"
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
				on:input={({ currentTarget }) => history.updateAutocomplete(currentTarget.value)}
			/>
		</div>
		<ul class="autocomplete-list">
			{#each suggestionsOptions as option (option.id)}
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
</style>
