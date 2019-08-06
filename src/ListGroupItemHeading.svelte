<script>
	import clsx from 'clsx';

	let className = '';
	export {className as class};

	$: classes = clsx(
		className,
		'list-group-item-heading',
	);
</script>

<h5 class="{classes}">
	<slot/>
</h5>
