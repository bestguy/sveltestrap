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
	export let id = '';

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
	{#if type === 'text'}
		<input {id} type="text" bind:value {readonly} class="{combinedClasses}" />
	{:else if type === 'password'}
		<input {id} type="password" bind:value {readonly} class="{combinedClasses}" />
	{:else if type === 'email'}
		<input {id} type="email" bind:value {readonly} class="{combinedClasses}" />
	{:else if type === 'file'}
		<input {id} type="file" bind:value {readonly} class="{combinedClasses}" />
	{:else if type === 'checkbox'}
		<input {id} type="checkbox" bind:value {readonly} class="{combinedClasses}" />
	{:else if type === 'radio'}
		<input {id} type="radio" bind:value {readonly} class="{combinedClasses}" />
	{:else if type === 'url'}
		<input {id} type="url" bind:value {readonly} class="{combinedClasses}" />
	{:else if type === 'number'}
		<input {id} type="number" bind:value {readonly} class="{combinedClasses}" />
	{:else if type === 'date'}
		<input {id} type="date" bind:value {readonly} class="{combinedClasses}" />
	{:else if type === 'time'}
		<input {id} type="time" bind:value {readonly} class="{combinedClasses}" />
	{:else if type === 'color'}
		<input {id} type="color" bind:value {readonly} class="{combinedClasses}" />
	{:else if type === 'search'}
		<input {id} type="search" bind:value {readonly} class="{combinedClasses}" />
	{/if}



{:else if tag === 'textarea'}

	<textarea {id} class="{combinedClasses}" bind:value></textarea>

{:else if tag === 'select'}

	<select {id} {multiple} class="{combinedClasses}">
		<slot />
	</select>

{/if}
