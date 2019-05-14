<script>
	let clazz;
	export { clazz as class };
	export let inverse = false;
	export let block = false;
	export let color = '';
	export let outline = false;

	const classNames = [
		'card',
	];

	if (inverse) {
		classNames.push('card-inverse');
	}

	if (block) {
		classNames.push('card-body');
	}

	if (color) {
		classNames.push(`${outline ? 'border' : 'bg'}-${color}`);
	}

	if (clazz) {
		classNames.push(clazz);
	}


</script>

<div class="{classNames.join(' ')}">
	<slot />
</div>
