<script>
	import clsx from 'clsx';

	let className = '';
	export { className as class };
	export let fluid = false;

	$: classes = clsx(
		className,
		'jumbotron',
		fluid ? 'jumbotron-fluid' : false,
	);
</script>

<div class="{classes}">
	<slot/>
</div>
