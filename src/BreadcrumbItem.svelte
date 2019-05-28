<script>
	let clazz = '';
	export { clazz as class };
	export let active = false;

	$: classes = `${clazz}${active ? ' active' : ''} breadcrumb-item`;
</script>

<li class="{classes}" aria-current="{active ? 'page' : undefined}">
	<slot />
</li>
