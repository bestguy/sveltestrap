<script>
	let clazz;
	export { clazz as class };
	export let noGutters = false;
	export let form = false;

	const classNames = [];

	if (clazz) {
		classNames.push(clazz);
	}

	if (noGutters) {
		classNames.push('no-gutters');
	}

	classNames.push(form ? 'form-row' : 'row');
</script>

<div class="{classNames.join(' ')}">
	<slot />
</div>
