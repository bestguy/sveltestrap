<script>
	import Dropdown from '../../../src/Dropdown.svelte';
	import DropdownToggle from '../../../src/DropdownToggle.svelte';
	import DropdownMenu from '../../../src/DropdownMenu.svelte';
	import DropdownItem from '../../../src/DropdownItem.svelte';

	let isOpen = false;

	function toggleOpen() {
		isOpen = !isOpen;
	}

</script>

<Dropdown {isOpen} toggle="{toggleOpen}">
	<DropdownToggle caret>
		Dropdown
	</DropdownToggle>
	<DropdownMenu>
		<DropdownItem header>Header</DropdownItem>
		<DropdownItem disabled>Action</DropdownItem>
		<DropdownItem>Another Action</DropdownItem>
		<DropdownItem divider />
		<DropdownItem on:click="{() => alert('Clicked item!')}">Another Action</DropdownItem>
	</DropdownMenu>
</Dropdown>
