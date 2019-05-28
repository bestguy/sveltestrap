<script>
	let clazz = '';
	export { clazz as class };

	$: classes = `${clazz} card-columns`;
</script>

<div class="{classes}">
	<slot />
</div>
