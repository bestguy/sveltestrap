<script>
	import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';
</script>

<UncontrolledButtonDropdown>
	<DropdownToggle caret>
		Dropdown
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem header>Header</DropdownItem>
		<DropdownItem disabled>Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem divider />
		<DropdownItem>Another Action</DropdownItem>
	</DropdownMenu>
</UncontrolledButtonDropdown>
