<script>
	import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';

	let isOpen = false;
</script>

<ButtonDropdown {isOpen} toggle="{() => isOpen = !isOpen}">
	<DropdownToggle caret>
		Button Dropdown
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem header>Header</DropdownItem>
		<DropdownItem disabled>Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem divider />
		<DropdownItem>Another Action</DropdownItem>
	</DropdownMenu>
</ButtonDropdown>
