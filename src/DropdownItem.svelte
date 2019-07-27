<script>
	import { getContext } from 'svelte';
	import clsx from 'clsx';

	const context = getContext("dropdownContext");

	let className = '';
	export { className as class };

	export let active = false;
	export let disabled = false;
	export let divider = false;
	export let header = false;
	export let toggle = true;
	export let href = '';

	$: classes = clsx(
		className,
		{
			disabled,
			'dropdown-item': !divider && !header,
			active: active,
			'dropdown-header': header,
			'dropdown-divider': divider
		},
	);

	function handleItemClick(e) {
		if (disabled || header || divider) {
			e.preventDefault();
			return;
		}

		if (toggle) {
			$context.toggle(e);
		}
	}
</script>

{#if header}
	<h6 on:click on:click="{handleItemClick}" class="{classes}">
		<slot />
	</h6>

{:else if divider}
	<div on:click on:click="{handleItemClick}" class="{classes}">
		<slot />
	</div>
{:else if href}
	<a on:click on:click="{handleItemClick}" {href} class="{classes}">
		<slot />
	</a>
{:else}
	<button on:click on:click="{handleItemClick}" class="{classes}">
		<slot />
	</button>
{/if}
