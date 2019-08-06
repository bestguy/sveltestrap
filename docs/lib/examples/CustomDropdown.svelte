<script>
	import { Dropdown, DropdownMenu, DropdownToggle } from 'sveltestrap';

	let isOpen = false;

	function toggle() {
		isOpen = !isOpen;
	}
</script>

<Dropdown {isOpen} toggle="{toggle}">
	<DropdownToggle
		tag="span"
		data-toggle="dropdown"
		aria-expanded="{isOpen}"
	>
		Custom Dropdown Content
	</DropdownToggle>
	<DropdownMenu>
		<div on:click="{toggle}">Custom dropdown item</div>
		<div on:click="{toggle}">Custom dropdown item</div>
		<div on:click="{toggle}">Custom dropdown item</div>
		<div on:click="{toggle}">Custom dropdown item</div>
	</DropdownMenu>
</Dropdown>
