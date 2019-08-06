<script>
	import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';

	let isOpen = false;
	export let group = false;
	export let size = '';
	let className = '';
	export { className as class };
</script>

<Dropdown {isOpen} toggle="{() => isOpen = !isOpen}" class="{className}" {size} {group}>
	<DropdownToggle caret>
		Dropdown
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem header>Header</DropdownItem>
		<DropdownItem>Action</DropdownItem>
	</DropdownMenu>
</Dropdown>
