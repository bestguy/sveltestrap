<script>
	import Alert from '../../../src/Alert.svelte';

	let isOpen = true;

	function toggle() {
		isOpen = !isOpen;
	}
</script>

<Alert toggle="{toggle}" {isOpen}>
	<h1>Hello World!</h1>
</Alert>
