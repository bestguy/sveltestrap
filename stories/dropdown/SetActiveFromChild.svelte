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
      <DropdownMenu>
        <DropdownItem href="/blah" active>Link</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Nav>
</Navbar>
