<script>
	import clsx from 'clsx';

	let className = '';
	export { className as class };

	$: classes = clsx(
		className,
		'card-link',
	);
</script>


<a class="{classes}">
	<slot />
</a>
