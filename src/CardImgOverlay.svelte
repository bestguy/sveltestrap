<script>
	import clsx from 'clsx';

	let className = '';
	export { className as class };

	$: classes = clsx(
		className,
		'card-img-overlay',
	);
</script>


<div class="{classes}">
	<slot />
</div>
