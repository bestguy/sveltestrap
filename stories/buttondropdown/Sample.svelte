<script lang="ts">
  import {
    ButtonDropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from 'sveltestrap';
</script>

<ButtonDropdown>
  <DropdownToggle color="primary" caret>
    Click Me
  </DropdownToggle>
  <DropdownMenu>
    <DropdownItem header>Header</DropdownItem>
    <DropdownItem>Some Action</DropdownItem>
    <DropdownItem disabled>Action (disabled)</DropdownItem>
    <DropdownItem divider />
    <DropdownItem>Foo Action</DropdownItem>
    <DropdownItem>Bar Action</DropdownItem>
    <DropdownItem>Quo Action</DropdownItem>
  </DropdownMenu>
</ButtonDropdown>
