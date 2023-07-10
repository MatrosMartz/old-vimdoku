<script lang="ts">
	import '@skeletonlabs/skeleton/styles/all.css'

	import './theme.postcss'
	import { Vim, Screen, Sudoku } from '$infra/svelte/ui'
	import { modes, modesStore, vimScreen, vimScreenStore } from '$infra/svelte/stores'
	import { Modes, WindowPrimaryKinds } from './domain/models'

	function keyHandler(ev: KeyboardEvent) {
		const { key } = ev
		if ($modesStore === Modes.Normal) {
			if (key === ':') {
				modes.setCommand()
				ev.preventDefault()
			}
		}
		if (key === 'Escape') {
			modes.setNormal()
			if (vimScreen.getValue().secondary != null) vimScreen.removeSecondary()
		}
	}

	$: if ($vimScreenStore.secondary != null) modes.setNormal()
	$: if ($modesStore === Modes.Command) vimScreen.removeSecondary()
</script>

<Vim.SettingsBtn />
<Screen.SettingsWindow />
{#if $vimScreenStore.primary === WindowPrimaryKinds.Init}
	<Screen.InitialWindow />
{:else}
	<Sudoku.Game />
{/if}
{#if $modesStore === Modes.Command}
	<Vim.CommandPalette />
{/if}
<Vim.StatusBar />

<svelte:window on:keydown={keyHandler} />
