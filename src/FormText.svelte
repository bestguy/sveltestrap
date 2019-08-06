<script>
	import clsx from 'clsx';

	let className = '';
	export { className as class };
	export let inline = false;
	export let color = 'muted';

	$: classes = clsx(
		className,
		!inline ? 'form-text' : false,
		color ? `text-${color}` : false
	);
</script>

<small class="{classes}">
	<slot/>
</small>
