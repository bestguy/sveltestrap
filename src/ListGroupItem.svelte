<script>
	import clsx from 'clsx';

	let className = '';
	export {className as class};
	export let active = false;
	export let disabled = false;
	export let color = '';
	export let action = false;
	export let href = null;
	export let tag = null;

	$: classes = clsx(
		className,
		active ? 'active' : false,
		disabled ? 'disabled' : false,
		action ? 'list-group-item-action' : false,
		color ? `list-group-item-${color}` : false,
		'list-group-item',
	);
</script>

{#if href}
	<a class="{classes}" {href} {disabled} {active}>
		<slot/>
	</a>
{:else if tag === 'button'}
	<button class="{classes}" type="button" on:click {disabled} {active}>
		<slot/>
	</button>
{:else}
<li class="{classes}" {disabled} {active}>
	<slot/>
</li>
{/if}
