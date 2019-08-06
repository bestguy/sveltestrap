<script>
	import Alert from './Alert.svelte';

	let isOpen = true;
</script>

<Alert {isOpen} toggle="{() => isOpen = false}" {...$$props}>
	<slot />
</Alert>
