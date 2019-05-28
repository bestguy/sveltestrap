<script>
	let clazz = '';
	export { clazz as class };
	export let inverse = false;
	export let block = false;
	export let color = '';
	export let outline = false;
	export let id = '';

	$: classNames = `card${inverse ? ' card-inverse' : ''}${block ? ' card-body' : ''}${color ? `${outline ? ' border' : ' bg'}-${color}` : ''}${clazz ? ` ${clazz}` : ''}`;
</script>

<div {id} class="{classNames}" on:click>
	<slot />
</div>
