<script lang="typescript">
  import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    NavItem,
    NavLink,
    Navbar,
    UncontrolledDropdown
  } from 'sveltestrap';
</script>

<Navbar color="light" light expand="md">
  <Nav class="ml-auto" navbar>
    <NavItem>
      <NavLink href="/components/">Inactive Link</NavLink>
    </NavItem>
    <UncontrolledDropdown setActiveFromChild>
      <DropdownToggle nav class="nav-link" caret>Dropdown</DropdownToggle>
      <DropdownMenu>
        <DropdownItem tag="a" href="/blah" active>Link</DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  </Nav>
</Navbar>
