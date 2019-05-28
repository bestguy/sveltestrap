<script>
	let clazz = '';
	export { clazz as class };
	export let ariaLabel = 'breadcrumb';
	export let listClassName = '';

	$: listClasses = `breadcrumb${listClassName ? ` ${listClassName}` : ''}`;
</script>

<nav aria-label="{ariaLabel}" class="{clazz}">
	<ol class="{listClasses}">
		<slot />
	</ol>
</nav>

