<script>
	let clazz = '';
	export { clazz as class };
	export let role = 'toolbar';
	export let ariaLabel = '';

	$: classes = `${clazz} btn-toolbar`;
</script>

<div aria-label="{ariaLabel}" class="{classes}">
	<slot />
</div>
