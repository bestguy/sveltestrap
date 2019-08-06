<script>
	import { getContext } from 'svelte';
	import clsx from 'clsx';

	import Button from './Button.svelte';

	const context = getContext("dropdownContext");

	let className = '';
	export { className as class };
	export let caret = false;
	export let color = 'secondary';
	export let disabled = false;
	export let ariaHaspopup = false;
	export let ariaLabel = 'Toggle Dropdown';
	export let split = false;
	export let nav = false;
	export let size = '';
	export let tag = null;
	export let outline = false;

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
	<a on:click on:click="{toggleButton}" href="#nav" class="{classes}">
		<slot>
			<span class="sr-only">{ariaLabel}</span>
		</slot>
	</a>
{:else if tag === 'span'}
	<span on:click on:click="{toggleButton}" class="{classes}" {color} {size}>
		<slot>
			<span class="sr-only">{ariaLabel}</span>
		</slot>
	</span>
{:else}
	<Button on:click on:click="{toggleButton}" class="{classes}" {color} {size} {outline}>
		<slot>
			<span class="sr-only">{ariaLabel}</span>
		</slot>
	</Button>
{/if}

