<script>
	let clazz = '';
	export { clazz as class };

	$: classes = `${clazz} card-title`;
</script>


<div class="{classes}">
	<slot />
</div>
