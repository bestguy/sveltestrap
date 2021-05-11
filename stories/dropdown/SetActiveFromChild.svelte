<script lang="ts">
  import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    NavItem,
    NavLink,
    Navbar,
    Dropdown
  } from 'sveltestrap';
</script>

<Navbar color="dark" dark expand="md">
  <Nav navbar>
    <NavItem>
      <NavLink href="/components/">Inactive Link</NavLink>
    </NavItem>
    <Dropdown nav setActiveFromChild>
      <DropdownToggle nav class="nav-link" caret>Dropdown</DropdownToggle>
      <DropdownMenu dark>
        <DropdownItem tag="a" href="/blah" active>Lancelot</DropdownItem>
        <DropdownItem tag="a" href="/blah">Link</DropdownItem>
        <DropdownItem tag="a" href="/blah">Secret</DropdownItem>
        <DropdownItem tag="a" href="/blah">Chimp</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Nav>
</Navbar>
