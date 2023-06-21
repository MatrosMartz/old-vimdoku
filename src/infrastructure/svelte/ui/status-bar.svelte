<script lang="ts">
	import { MistakeIcon } from '$infra/assets'
	import { formattedSelection, formattedTimer, mistakeStore, modesStore } from '../stores'
</script>

<footer
	class="absolute z-30 bottom-0 left-0 w-full flex justify-between bg-surface-300-600-token py-1 px-[2ch] text-tertiary-800-100-token"
>
	<section class="status-part">
		<span class="mode">{$modesStore.toUpperCase()}</span>
		<span class="mistakes text-error-500-400-token"><MistakeIcon />{$mistakeStore}</span>
	</section>
	<section class="status-part">
		<span>{$formattedSelection}</span>
		<span>Sudoku</span>
		<span>{$formattedTimer}</span>
	</section>
</footer>

<style lang="postcss">
	.status-part {
		@apply flex gap-7;
	}
	.mistakes {
		@apply flex gap-1;
	}
</style>
