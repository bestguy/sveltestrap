<script lang="ts">
  import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Dropdown,
    Input
  } from 'sveltestrap';

  let isOpen = false;
</script>

<Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
  <DropdownToggle tag="div" class="d-inline-block">
    <Input />
  </DropdownToggle>
  <DropdownMenu>
    <DropdownItem header>Header</DropdownItem>
    <DropdownItem disabled>Action</DropdownItem>
    <DropdownItem>Another Action</DropdownItem>
    <DropdownItem divider />
    <DropdownItem>Another Action</DropdownItem>
  </DropdownMenu>
</Dropdown>
