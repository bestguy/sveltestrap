<script lang="ts">
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from 'sveltestrap';
</script>

<Dropdown>
  <DropdownToggle caret>Dropdown's menu is right-aligned</DropdownToggle>
  <DropdownMenu right>
    <DropdownItem header>Header</DropdownItem>
    <DropdownItem disabled>Action</DropdownItem>
    <DropdownItem>Another Action</DropdownItem>
  </DropdownMenu>
</Dropdown>
