<script>
	import clsx from 'clsx';

	let className = '';
	export { className as class };

	$: classes = clsx(
		className,
		'input-group-text',
	);
</script>

<span class="{classes}">
	<slot />
</span>
