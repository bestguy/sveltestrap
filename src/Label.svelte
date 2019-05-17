<script>
	let clazz;
	export { clazz as class };
	export let hidden = false;
	export let check = false;
	export let size = '';
	export let fore;
	export { fore as for };
	export let id = '';

	$: classNames = `${hidden ? ' sr-only' : ''}${check ? ' form-check-label' : ''}${size ? `col-form-label-${size}` : ''}${clazz ? ` ${clazz}` : ''}`;

</script>

<label {id} class="{classNames}" for="{fore}">
	<slot />
</label>
