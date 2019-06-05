<script>
	import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'sveltestrap';
</script>

<InputGroup size="lg">
	<InputGroupAddon addonType="prepend">
		<InputGroupText>@lg</InputGroupText>
	</InputGroupAddon>
	<Input />
</InputGroup>
<br />
<InputGroup>
	<InputGroupAddon addonType="prepend">
		<InputGroupText>@normal</InputGroupText>
	</InputGroupAddon>
	<Input />
</InputGroup>
<br />
<InputGroup size="sm">
	<InputGroupAddon addonType="prepend">
		<InputGroupText>@sm</InputGroupText>
	</InputGroupAddon>
	<Input />
</InputGroup>
