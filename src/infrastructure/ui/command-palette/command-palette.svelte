<script lang="ts">
	import Timer from '~/timer/infrastructure/ui/timer.svelte'

	import { timerStore } from '~/timer/infrastructure/stores'
</script>

<div>
	<Timer />
	<div class="commands"><span>Normal</span><input type="text" /></div>
	<span class="line-number">0:0</span>
</div>
