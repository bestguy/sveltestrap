<script>
	let clazz;
    export { clazz as class };

	export let type = 'text';
	export let size;
	export let bsSize;
	export let valid = false;
	export let invalid = false;
	export let plaintext = false;
	export let addon = false;
	export let value;
	export let readonly = false;
	export let multiple = false;

	const checkInput = ['radio', 'checkbox'].indexOf(type) > -1;
	const isNotaNumber = new RegExp('\\D', 'g');

	const fileInput = type === 'file';
	const textareaInput = type === 'textarea';
	const selectInput = type === 'select';
	let tag = selectInput || textareaInput ? type : 'input';

	let formControlClass = 'form-control';

	if (plaintext) {
		formControlClass = `${formControlClass}-plaintext`;
		tag = 'input';
	} else if (fileInput) {
		formControlClass = `${formControlClass}-file`;
	} else if (checkInput) {
		if (addon) {
			formControlClass = null;
		} else {
			formControlClass = 'form-check-input';
		}
	}

	if (size && isNotaNumber.test(size)) {
		console.warn('Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.');
		bsSize = size;
		size = undefined;
	}

	const classNames = [];

	if (clazz) {
		classNames.push(clazz);
	}

	if (invalid) {
		classNames.push('is-invalid');
	}

	if (valid) {
		classNames.push('is-valid');
	}

	if (bsSize) {
		classNames.push(`form-control-${bsSize}`);
	}

	classNames.push(formControlClass);

	const combinedClasses = classNames.join(' ');
</script>
{#if tag === 'input'}

	<input {type} {value} {readonly} class="{combinedClasses}" />

{:else if tag === 'textarea'}

	<textarea class="{combinedClasses}">
		<slot />
	</textarea>

{:else if tag === 'select'}

	<select {multiple} class="{combinedClasses}">
		<slot />
	</select>

{/if}
