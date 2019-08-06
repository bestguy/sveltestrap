<script>
	import clsx from 'clsx';

	let className = '';
	export { className as class };
	export let inline = false;

	$: classes = clsx(
		className,
		inline ? 'form-inline' : false,
	);
</script>

<form class="{classes}">
	<slot />
</form>
