<script>
	let clazz;
	export { clazz as class };
	export let fluid = false;

	const classNames = [
		`container${fluid ? '-fluid' : ''}`,
	];

	if (clazz) {
		classNames.push(clazz);
	}
</script>

<div class="{classNames.join(' ')}">
	<slot />
</div>
