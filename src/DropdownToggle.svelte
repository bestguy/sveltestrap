<script>
	import clsx from 'clsx';

	import { context } from './DropdownContext';
	import Button from './Button.svelte';

	let className = '';
	export { className as class };
	export let caret = false;
	export let color = 'secondary';
	export let disabled = false;
	export let ariaHaspopup = false;
	export let ariaLabel = 'Toggle Dropdown';
	export let split = false;
	export let nav = false;

	$: classes = clsx(
		className,
		{
			'dropdown-toggle': caret || split,
			'dropdown-toggle-split': split,
			'nav-link': nav
		},
	);

	function toggleButton(e) {
		if (disabled) {
			e.preventDefault();
			return;
		}

		if (nav) {
			e.preventDefault();
		}

		$context.toggle(e)
	}
</script>

{#if nav}
	<a on:click on:click="{toggleButton}" href="#" class="{classes}">
		<slot>
			<span class="sr-only">{ariaLabel}</span>
		</slot>
	</a>
{:else}
	<Button on:click on:click="{toggleButton}" class="{classes}" {color}>
		<slot>
			<span class="sr-only">{ariaLabel}</span>
		</slot>
	</Button>
{/if}

