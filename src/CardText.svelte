<script>
	import clsx from 'clsx';

	let className = '';
	export { className as class };

	$: classes = clsx(
		className,
		'card-text',
	);
</script>


<p class="{classes}">
	<slot />
</p>
