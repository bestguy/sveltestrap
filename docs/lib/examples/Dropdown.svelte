<script>
	import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';

	let isOpen = false;
</script>

<Dropdown {isOpen} toggle="{() => isOpen = !isOpen}">
	<DropdownToggle caret>
		Dropdown
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem header>Header</DropdownItem>
		<DropdownItem>Some Action</DropdownItem>
		<DropdownItem disabled>Action (disabled)</DropdownItem>
		<DropdownItem divider />
		<DropdownItem>Foo Action</DropdownItem>
		<DropdownItem>Bar Action</DropdownItem>
		<DropdownItem>Quo Action</DropdownItem>
	</DropdownMenu>
</Dropdown>
