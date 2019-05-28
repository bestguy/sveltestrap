<script>
	let clazz = '';
	export { clazz as class };

	$: classes = `${clazz} card-deck`;
</script>


<div class="{classes}">
	<slot />
</div>
