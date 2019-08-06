<script>
	import clsx from 'clsx';

	let className = '';
	export {className as class};

	$: classes = clsx(
		className,
		'list-group-item-text',
	);
</script>

<p class="{classes}">
	<slot/>
</p>
