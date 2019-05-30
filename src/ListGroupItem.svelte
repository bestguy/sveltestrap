<script>
	import clsx from 'clsx';

	let className = '';
	export {className as class};
	export let active = false;
	export let disabled = false;
	export let color = '';
	export let action = false;

	$: classes = clsx(
		className,
		active ? 'active' : false,
		disabled ? 'disabled' : false,
		action ? 'list-group-item-action' : false,
		color ? `list-group-item-${color}` : false,
		'list-group-item',
	);
</script>

<li class="{classes}">
	<slot/>
</li>
