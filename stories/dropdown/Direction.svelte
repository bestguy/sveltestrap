<script lang="ts">
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from 'sveltestrap';
</script>

<Dropdown direction="up">
  <DropdownToggle caret>Dropup</DropdownToggle>
  <DropdownMenu>
    <DropdownItem>Another Action</DropdownItem>
    <DropdownItem>Another Action</DropdownItem>
  </DropdownMenu>
</Dropdown>

<Dropdown
  direction="left">
  <DropdownToggle caret>Dropleft</DropdownToggle>
  <DropdownMenu>
    <DropdownItem>Another Action</DropdownItem>
    <DropdownItem>Another Action</DropdownItem>
  </DropdownMenu>
</Dropdown>

<Dropdown
  direction="right">
  <DropdownToggle caret>Dropright</DropdownToggle>
  <DropdownMenu>
    <DropdownItem>Another Action</DropdownItem>
    <DropdownItem>Another Action</DropdownItem>
  </DropdownMenu>
</Dropdown>
