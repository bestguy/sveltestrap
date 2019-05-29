<script>
	import clsx from 'clsx';

	let className = '';
	export { className as class };
	export let id = '';

	$: classes = clsx(
		className,
		'card-header',
	);
</script>

<div {id} class="{classes}" on:click>
	<slot />
</div>
