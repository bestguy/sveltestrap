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

<Navbar color="light" light expand="md">
  <Nav class="ms-auto" navbar>
    <NavItem>
      <NavLink href="/components/">Inactive Link</NavLink>
    </NavItem>
    <Dropdown setActiveFromChild>
      <DropdownToggle nav class="nav-link" caret>Dropdown</DropdownToggle>
      <DropdownMenu>
        <DropdownItem href="/blah" active>Link</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Nav>
</Navbar>
