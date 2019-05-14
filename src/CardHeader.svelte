<script>
	let clazz;
	export { clazz as class };

	const classNames = [
		'card-header',
	];

	if (clazz) {
		classNames.push(clazz);
	}
</script>

<div class="{classNames.join(' ')}">
	<slot />
</div>
