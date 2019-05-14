<script>
	export let clazz;
	export { clazz as class };
	export let color;
	export let row = false;
	export let disabled = false;
	export let check = false;

	const classNames = [];

	if (color) {
		classNames.push(`has-${color}`);
	}

	if (row) {
		classNames.push('row');
	}

	classNames.push(check ? 'form-check' : 'form-group');

	if (check && disabled) {
		classNames.push('disabled');
	}

	if (clazz) {
		classNames.push(clazz);
	}

</script>

<div class="{classNames.join(' ')}">
	<slot />
</div>
