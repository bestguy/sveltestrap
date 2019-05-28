<script>
	let clazz = '';
	export { clazz as class };

	$: classes = `${clazz} card-footer`;
</script>

<div class="{classes}">
	<slot />
</div>
