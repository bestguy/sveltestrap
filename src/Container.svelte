<script>
	let clazz;
	export { clazz as class };
	export let fluid = false;
	export let id = '';

	$: classNames = `container${fluid ? '-fluid' : ''}${clazz ? ` ${clazz}` : ''}`;
</script>

<div {id} class="{classNames}">
	<slot />
</div>
