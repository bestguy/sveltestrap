<script>
	import clsx from 'clsx';

	let className = '';
	export { className as class };
	export let active = false;
	export let block = false;
	export let disabled = false;
	export let color = 'secondary';
	export let outline = false;
	export let size = '';
	export let value = '';
	export let id = '';
	export let close = false;

	$: classes = clsx(
		className,
		{ close },
		close || 'btn',
		close || `btn${outline ? '-outline' : ''}-${color}`,
		size ? `btn-${size}` : false,
		block ? 'btn-block' : false,
		{ active, disabled }
	);
</script>

<button
	{id}
	class="{classes}"
	on:click
	{value}
>
	<slot />
</button>
