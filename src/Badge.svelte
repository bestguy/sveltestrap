<script>
	import clsx from 'clsx';

	let className = '';
	export { className as class };
	export let color = 'secondary';
	export let pill = false;

	$: classes = clsx(
		className,
		'badge',
		`badge-${color}`,
		pill ? 'badge-pill' : false
	);
</script>

<span class="{classes}">
	<slot />
</span>
