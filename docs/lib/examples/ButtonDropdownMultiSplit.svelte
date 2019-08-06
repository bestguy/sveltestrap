<script>
	import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';

	export let color;
	export let text;

	let isOpen = false;
</script>

<ButtonDropdown {isOpen} toggle="{() => isOpen = !isOpen}">
	<Button id="caret" {color}>{text}</Button>
	<DropdownToggle split {color} />
	<DropdownMenu>
		<DropdownItem header>Header</DropdownItem>
		<DropdownItem disabled>Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem divider />
		<DropdownItem>Another Action</DropdownItem>
	</DropdownMenu>
</ButtonDropdown>
