<script>
	let clazz = '';
	export { clazz as class };
	export let active = false;
	export let block = false;
	export let disabled = false;
	export let color = 'secondary';
	export let outline = false;
	export let size = '';
	export let value = '';
	export let id = '';

	$: classNames = `btn btn${outline ? '-outline' : ''}-${color}${block ? ' btn-block' : ''}${active ? ' active' : ''}${disabled ? ' disabled' : ''}${size ? ` btn-${size}` : ''}${clazz ? ` ${clazz}` : ''}`;
</script>

<button
	{id}
	class="{classNames}"
	on:click
	{value}
>
	<slot />
</button>
