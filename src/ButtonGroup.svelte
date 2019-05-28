<script>
	let clazz = '';
    export { clazz as class };
    export let size = '';
    export let vertical = false;
    export let id = '';

    $: classNames = `${vertical ? 'btn-group-vertical' : 'btn-group'}${clazz ? ` ${clazz}` : ''}${size ? ` btn-group-${size}`: ''}`;

</script>

<div {id} class="{classNames}">
	<slot />
</div>
