<script>
	let clazz;
	export { clazz as class };
	export let id;

	$: classNames = `card-header${clazz ? ` ${clazz}` : ''}`;
</script>

<div {id} class="{classNames}">
	<slot />
</div>
