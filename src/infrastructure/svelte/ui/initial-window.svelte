<section class="flex flex-col gap-4">
	<h2 class="text-base unstyled font-medium">VIMDOKU - VIM suDOKU</h2>

	<div>
		<p>Version 1.0</p>
		<p>by <a href="https://github.com/tsonkoalt">TsonkoAlt</a>.</p>
		<p>Vimdoku is sudoku game with VIM shortcuts</p>
	</div>
	<table class="commands">
		<tr>
			<td>type</td>
			<td>:q<span class="key">&lt;Enter&gt;</span></td>
			<td>to exit</td>
		</tr>
		<tr>
			<td>type</td>
			<td>:help<span class="key">&lt;Enter&gt;</span></td>
			<td>for on-line help</td>
		</tr>
		<tr>
			<td>type</td>
			<td>:help start<span class="key">&lt;Enter&gt;</span></td>
			<td>for help to start game</td>
		</tr>
		<tr>
			<td>type</td>
			<td>:start <span class="option">&#123;Difficulty&#125;</span></td>
			<td>for start game</td>
		</tr>
	</table>

	<div>
		<button class="btn-start bg-tertiary-100-800-token mt-2">Start game</button>
	</div>
</section>

<style lang="postcss">
	.commands td {
		@apply text-left;
	}
	.commands td:nth-child(3n + 2) {
		@apply px-[3ch];
	}

	.btn-start {
		@apply px-2 py-1 hover:brightness-90;
	}
	:global(.dark) .btn-start {
		@apply hover:brightness-110;
	}
</style>
