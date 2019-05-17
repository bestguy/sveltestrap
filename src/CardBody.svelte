<script>
	let clazz;
	export { clazz as class };
	export let id = '';

	$: classNames = `card-body${clazz ? ` ${clazz}` : ''}`;
</script>

<div {id} class="{classNames}">
	<slot />
</div>
