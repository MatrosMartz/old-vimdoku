<script lang="ts">
	import { notesStore } from '$infra/svelte/stores'
</script>

<section class="notes">
	<h6>Notes</h6>
	<ul data-testid="notes">
		{#each $notesStore as note, i (i)}
			<li data-testid="note-{i + 1}">{note ?? ''}</li>
		{/each}
	</ul>
</section>
