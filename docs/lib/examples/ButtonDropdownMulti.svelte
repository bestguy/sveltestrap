<script>
	import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';

	export let color;
	export let text;

	let isOpen = false;
</script>

<ButtonDropdown {isOpen} toggle="{() => isOpen = !isOpen}">
	<DropdownToggle {color} caret>
		{text}
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem header>Header</DropdownItem>
		<DropdownItem disabled>Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem divider />
		<DropdownItem>Another Action</DropdownItem>
	</DropdownMenu>
</ButtonDropdown>
