<script>
	let clazz;
	export { clazz as class };
	export let noGutters = false;
	export let form = false;
	export let id;

	$: classNames = `${clazz ? clazz : ''}${noGutters ? ' no-gutters' : ''}${form ? ' form-row' : ' row'}`;
</script>

<div {id} class="{classNames}">
	<slot />
</div>
