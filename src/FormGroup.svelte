<script>
	export let clazz = '';
	export { clazz as class };
	export let color = '';
	export let row = false;
	export let disabled = false;
	export let check = false;
	export let id = '';

	$: classNames = `${color ? `has-${color}` : ''}${row ? ' row' : ''}${check ? ' form-check' : ' form-group'}${check && disabled ? ' disabled' : ''}${clazz ? ` ${clazz}` : ''}`;

</script>

<div {id} class="{classNames}">
	<slot />
</div>
