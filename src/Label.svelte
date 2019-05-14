<script>
	let clazz;
	export { clazz as class };
	export let hidden = false;
	export let check = false;
	export let size = '';
	export let fore;
	export { fore as for };

	const classNames = [];

	if (hidden) {
		classNames.push('sr-only');
	}

	if (check) {
		classNames.push('form-check-label');
	}

	if (size) {
		classNames.push(`col-form-label-${size}`);
	}

	if (clazz) {
		classNames.push(clazz);
	}

</script>

<label class="{classNames.join(' ')}" for="{fore}">
	<slot />
</label>
