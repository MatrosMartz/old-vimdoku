<script lang="ts">
	import '@skeletonlabs/skeleton/styles/all.css'
	import './theme.postcss'

	import {
		board,
		modes,
		modesStore,
		selection,
		vimScreen,
		vimScreenStore,
	} from '$infra/svelte/stores'
	import { Screen, Sudoku, Vim } from '$infra/svelte/ui'

	import { Modes, WindowPrimaryKinds } from './domain/models'

	let times = ''

	function keyHandler(ev: KeyboardEvent) {
		const { key } = ev

		if (key === ':' && modes.value === Modes.Normal) {
			modes.setCommand()
			ev.preventDefault()
		}

		if (key === 'Escape') {
			modes.setNormal()
			if (vimScreen.value.secondary != null) vimScreen.removeSecondary()
		}

		if (board.value.hasBoard && modes.value === Modes.Normal) {
			if (/^[iIaAoO]$/.test(key)) modes.setInsert()
			else if (/^[nN]$/.test(key)) modes.setAnnotation()
			else if (/^[hjkl]$/.test(key)) {
				const parsedTimes = Number(times)

				if (key === 'h') selection.moveLeft(parsedTimes)
				else if (key === 'j') selection.moveDown(parsedTimes)
				else if (key === 'k') selection.moveUp(parsedTimes)
				else if (key === 'l') selection.moveRight(parsedTimes)
			}

			if (/^[1-9]$/.test(key) || (key.includes('0') && times.length > 0)) times += key
			else times = ''
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
