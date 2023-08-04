<script lang="ts">
  import {
    ButtonToolbar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from 'sveltestrap';
</script>

<ButtonToolbar>
  <Dropdown autoClose={true}>
    <DropdownToggle caret>Default</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>Menu item</DropdownItem>
      <DropdownItem>Menu item</DropdownItem>
      <DropdownItem>Menu item</DropdownItem>
    </DropdownMenu>
  </Dropdown>

  <Dropdown autoClose="outside">
    <DropdownToggle caret>Outside</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>Menu item</DropdownItem>
      <DropdownItem>Menu item</DropdownItem>
      <DropdownItem>Menu item</DropdownItem>
    </DropdownMenu>
  </Dropdown>

  <Dropdown autoClose="inside">
    <DropdownToggle caret>Inside</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>Menu item</DropdownItem>
      <DropdownItem>Menu item</DropdownItem>
      <DropdownItem>Menu item</DropdownItem>
    </DropdownMenu>
  </Dropdown>

  <Dropdown autoClose={false}>
    <DropdownToggle caret>manually</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>Menu item</DropdownItem>
      <DropdownItem>Menu item</DropdownItem>
      <DropdownItem>Menu item</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</ButtonToolbar>
