<script>
	import Input from '../../../src/Input.svelte';
	import FormGroup from '../../../src/FormGroup.svelte';
	import Label from '../../../src/Label.svelte';

	let inputValue = 'world';
</script>
<div>
	Hello, {inputValue}!

	<FormGroup>
		<Label for="input-text">Input Label</Label>
		<Input bind:value="{inputValue}" id="input-text" />
	</FormGroup>
</div>
