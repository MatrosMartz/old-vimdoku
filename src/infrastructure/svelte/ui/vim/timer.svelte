<script lang="ts">
	import { formattedTimer } from '$infra/svelte/stores'
</script>

<span class="timer" data-testid="timer">{$formattedTimer}</span>
