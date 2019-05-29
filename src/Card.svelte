<script>
	import clsx from 'clsx';

	let className = '';
	export { className as class };
	export let inverse = false;
	export let color = '';
	export let body = false;
	export let outline = false;
	export let id = '';

	$: classes = clsx(
		className,
		'card',
		inverse ? 'text-white' : false,
		body ? 'card-body' : false,
		color ? `${outline ? 'border' : 'bg'}-${color}` : false
	);
</script>

<div {id} class="{classes}" on:click>
	<slot />
</div>
