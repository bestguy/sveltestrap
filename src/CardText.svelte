<script>
	let clazz = '';
	export { clazz as class };

	$: classes = `${clazz} card-text`;
</script>


<div class="{classes}">
	<slot />
</div>
