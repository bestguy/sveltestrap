<script>
	import Badge from '../../../src/Badge.svelte';
	import Button from '../../../src/Button.svelte';

	let clickCount = 0;

	function updateCount() {
		++clickCount;
	}
</script>

<Button color="primary" on:click="{updateCount}">
	Clicked <Badge>{clickCount}</Badge>
</Button>
