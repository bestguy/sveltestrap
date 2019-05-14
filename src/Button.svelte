<script>
	let clazz;
	export { clazz as class };
	export let active = false;
	export let block = false;
	export let disabled = false;
	export let color = 'secondary';
	export let outline = false;
	export let size;

	const classNames = [
		'btn',
		`btn${outline ? '-outline' : ''}-${color}`,
	];

	if (block) {
		classNames.push('btn-block');
	}

	if (active) {
		classNames.push('active');
	}

	if (disabled) {
		classNames.push('disabled');
	}

	if (size) {
		classNames.push(`btn-${size}`);
	}

	if (clazz) {
		classNames.push(clazz);
	}

</script>

<button
	class="{classNames.join(' ')}"
	on:click
>
	<slot />
</button>
