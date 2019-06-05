<script>
	import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'sveltestrap';
</script>

<InputGroup>
	<InputGroupAddon addonType="prepend">
		<InputGroupText>@</InputGroupText>
	</InputGroupAddon>
	<Input placeholder="username" />
</InputGroup>
<br />
<InputGroup>
	<InputGroupAddon addonType="prepend">
		<InputGroupText>
			<Input addon type="checkbox" aria-label="Checkbox for following text input" />
		</InputGroupText>
	</InputGroupAddon>
	<Input placeholder="Check it out" />
</InputGroup>
<br />
<InputGroup>
	<Input placeholder="username" />
	<InputGroupAddon addonType="append">
		<InputGroupText>
			@example.com
		</InputGroupText>
	</InputGroupAddon>
</InputGroup>
<br />
<InputGroup>
	<InputGroupAddon addonType="prepend">
		<InputGroupText>$</InputGroupText>
		<InputGroupText>$</InputGroupText>
	</InputGroupAddon>
	<Input placeholder="Dolla dolla billz yo!" />
	<InputGroupAddon addonType="append">
		<InputGroupText>$</InputGroupText>
		<InputGroupText>$</InputGroupText>
	</InputGroupAddon>
</InputGroup>
<br />
<InputGroup>
	<InputGroupAddon addonType="prepend">
		<InputGroupText>$</InputGroupText>
	</InputGroupAddon>
	<Input placeholder="Amount" min={0} max={100} type="number" step="1" />
	<InputGroupAddon addonType="append">
		<InputGroupText>.00</InputGroupText>
	</InputGroupAddon>
</InputGroup>
