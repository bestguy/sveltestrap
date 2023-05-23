<script>
  import Dropdown from '../Dropdown.svelte';
  import DropdownMenu from '../DropdownMenu.svelte';
  import DropdownItem from '../DropdownItem.svelte';
  import DropdownToggle from '../DropdownToggle.svelte';
</script>

<Dropdown>
  <DropdownToggle caret class="coconut">Open</DropdownToggle>
  <DropdownMenu class="cocoa">
    <DropdownItem>Alpha</DropdownItem>
  </DropdownMenu>
</Dropdown>
