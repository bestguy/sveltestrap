<script>
	let clazz = '';
	export { clazz as class };

	$: classes = `${clazz} card-img-overlay`;
</script>


<div class="{classes}">
	<slot />
</div>
