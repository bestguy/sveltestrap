<script>
	import { InputGroup, InputGroupText, InputGroupAddon, Input } from 'sveltestrap';
</script>

<InputGroup>
	<InputGroupAddon addonType="prepend">
		<InputGroupText>To the Left!</InputGroupText>
	</InputGroupAddon>
	<Input />
</InputGroup>
<br />
<InputGroup>
	<Input />
	<InputGroupAddon addonType="append">
		<InputGroupText>To the Right!</InputGroupText>
	</InputGroupAddon>
</InputGroup>
<br />
<InputGroup>
	<InputGroupAddon addonType="prepend">
		<InputGroupText>To the Left!</InputGroupText>
	</InputGroupAddon>
	<Input placeholder="and..." />
	<InputGroupAddon addonType="append">
		<InputGroupText>To the Right!</InputGroupText>
	</InputGroupAddon>
</InputGroup>
