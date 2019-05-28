<script>
	let clazz = '';
	export { clazz as class };
	export let color = 'secondary';
	export let pill = false;

	$: classNames = `${clazz} badge badge-${color}${pill ? ' badge-pill' : ''}`;
</script>

<span class="{classNames}">
	<slot />
</span>
