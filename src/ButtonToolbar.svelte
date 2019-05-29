<script>
	import clsx from 'clsx';

	let className = '';
	export { className as class };
	export let role = 'toolbar';
	export let ariaLabel = '';

	$: classes = clsx(
		className,
		'btn-toolbar'
	);
</script>

<div aria-label="{ariaLabel}" class="{classes}">
	<slot />
</div>
