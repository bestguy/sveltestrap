<script>
	import ButtonGroup from '../../../src/ButtonGroup.svelte';
	import Button from '../../../src/Button.svelte';

	let selected = 1;

	function setSelected(num) {
		selected = num;
	}
</script>

<ButtonGroup>
	<Button active="{selected === 1}" on:click="{() => setSelected(1)}">1</Button>
	<Button active="{selected === 2}" on:click="{() => setSelected(2)}">2</Button>
	<Button active="{selected === 3}" on:click="{() => setSelected(3)}">3</Button>
</ButtonGroup>
