<script>
	import Dropdown from './Dropdown.svelte';

	let className = '';
	export { className as class };
	export let addonType;
	export let toggle;
	export let isOpen;

	if (['prepend', 'append'].indexOf(addonType) === -1) {
		throw new Error(`addonType must be one of 'prepend', 'append'. Received '${addonType}' instead.`);
	}

</script>

<Dropdown class="{className}" {addonType} {toggle} {isOpen}>
	<slot />
</Dropdown>
