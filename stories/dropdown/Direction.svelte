<script lang="typescript">
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from 'sveltestrap';

  let isOpen = false;
  let leftIsOpen = false;
  let rightIsOpen = false;
</script>

<Dropdown direction="up" {isOpen} toggle={() => (isOpen = !isOpen)}>
  <DropdownToggle caret>Dropup</DropdownToggle>
  <DropdownMenu>
    <DropdownItem>Another Action</DropdownItem>
    <DropdownItem>Another Action</DropdownItem>
  </DropdownMenu>
</Dropdown>

<Dropdown
  direction="left"
  isOpen={leftIsOpen}
  toggle={() => (leftIsOpen = !leftIsOpen)}>
  <DropdownToggle caret>Dropleft</DropdownToggle>
  <DropdownMenu>
    <DropdownItem>Another Action</DropdownItem>
    <DropdownItem>Another Action</DropdownItem>
  </DropdownMenu>
</Dropdown>

<Dropdown
  direction="right"
  isOpen={rightIsOpen}
  toggle={() => (rightIsOpen = !rightIsOpen)}>
  <DropdownToggle caret>Dropright</DropdownToggle>
  <DropdownMenu>
    <DropdownItem>Another Action</DropdownItem>
    <DropdownItem>Another Action</DropdownItem>
  </DropdownMenu>
</Dropdown>
