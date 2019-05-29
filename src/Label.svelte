<script>
	import clsx from 'clsx';

	const colWidths = ['xs', 'sm', 'md', 'lg', 'xl'];

	let className = '';
	export { className as class };
	export let hidden = false;
	export let check = false;
	export let size = '';
	export let fore = '';
	export { fore as for };
	export let id = '';
	export let xs = '';
	export let sm = '';
	export let md = '';
	export let lg = '';
	export let xl = '';
	export let widths = colWidths;

	$: classes = clsx(
		className,
		hidden ? 'sr-only' : false,
		check ? 'form-check-label' : false,
		size ? `col-form-label-${size}` : false,
		// colClasses,
		// colClasses.length ? 'col-form-label' : false,
	);

</script>

<label {id} class="{classes}" for="{fore}">
	<slot />
</label>
