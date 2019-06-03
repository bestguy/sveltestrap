<script>
	import { Button, ButtonGroup } from 'sveltestrap';

	let rSelected = null;
	let cSelected = [];

	function onCheckboxBtnClick(num) {
		const index = cSelected.indexOf(num);
		if (index === -1) {
			cSelected = [...cSelected, num];
		} else {
			cSelected = cSelected.filter((d) => d !== num);
		}
	}
</script>

<h5>Radio Buttons</h5>
<ButtonGroup>
	<Button color="primary" on:click="{() => rSelected = 1}" active="{rSelected === 1}">One</Button>
	<Button color="primary" on:click="{() => rSelected = 2}" active="{rSelected === 2}">Two</Button>
	<Button color="primary" on:click="{() => rSelected = 3}" active="{rSelected === 3}">Three</Button>
</ButtonGroup>
<p>Selected: {rSelected || ''}</p>

<h5>Checkbox Buttons</h5>
<ButtonGroup>
	<Button color="primary" on:click="{() => onCheckboxBtnClick(1)}" active="{cSelected.includes(1)}">One</Button>
	<Button color="primary" on:click="{() => onCheckboxBtnClick(2)}" active="{cSelected.includes(2)}">Two</Button>
	<Button color="primary" on:click="{() => onCheckboxBtnClick(3)}" active="{cSelected.includes(3)}">Three</Button>
</ButtonGroup>
<p>Selected: {JSON.stringify(cSelected)}</p>
