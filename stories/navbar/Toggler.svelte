<script>
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from 'sveltestrap';

  let isOpen = true;
  const toggle = () => (isOpen = !isOpen);
</script>

<Navbar color="light" light>
  <NavbarBrand href="/" class="mr-auto">sveltestrap</NavbarBrand>
  <NavbarToggler on:click={toggle} className="mr-2" />
  <Collapse {isOpen} navbar>
    <Nav navbar>
      <NavItem>
        <NavLink href="#components/">Components</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="https://github.com/bestguy/sveltestrap">GitHub</NavLink>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>
