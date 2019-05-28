<script>
	import Button from '../../../src/Button.svelte';
	import Collapse from '../../../src/Collapse.svelte';

	let isOpen = true;

	function toggleOpen() {
		isOpen = !isOpen;
	}
</script>

<Button on:click="{toggleOpen}">{isOpen ? 'Collapse!' : 'Open!'}</Button>
<Collapse {isOpen}>
	Collapsable text!
</Collapse>
