<script lang="ts">
	import { cmdInputStore } from '../stores'

	import Timer from './timer.svelte'
</script>

<div>
	<Timer />
	<div class="commands"><span>Normal</span><input type="text" bind:this={$cmdInputStore} /></div>
	<span class="line-number">0:0</span>
</div>
