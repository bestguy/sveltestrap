<script>
	import clsx from 'clsx';

	import Button from './Button.svelte';

	let className = '';
	export {className as class};
	export let type = 'button';

	$: classes = clsx(
		className,
		'navbar-toggler',
	);
</script>

<Button on:click class="{classes}">
	<slot>
		<span class="navbar-toggler-icon" />
	</slot>
</Button>
