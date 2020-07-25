<script lang="ts">
  import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown
  } from 'sveltestrap';
</script>

<UncontrolledDropdown>
  <DropdownToggle caret>Dropdown</DropdownToggle>
  <DropdownMenu>
    <DropdownItem header>Header</DropdownItem>
    <DropdownItem disabled>Action</DropdownItem>
    <DropdownItem>Another Action</DropdownItem>
    <DropdownItem divider />
    <DropdownItem>Another Action</DropdownItem>
  </DropdownMenu>
</UncontrolledDropdown>
