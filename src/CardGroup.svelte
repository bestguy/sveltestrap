<script>
	let clazz = '';
	export { clazz as class };

	$: classes = `${clazz} card-group`;
</script>

<div class="{classes}">
	<slot />
</div>
