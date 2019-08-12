<script>
  import Collapse from "../src/Collapse.svelte";
  import DropdownItem from "../src/DropdownItem.svelte";
  import DropdownMenu from "../src/DropdownMenu.svelte";
  import DropdownToggle from "../src/DropdownToggle.svelte";
  import Nav from "../src/Nav.svelte";
  import NavItem from "../src/NavItem.svelte";
  import NavLink from "../src/NavLink.svelte";
  import Navbar from "../src/Navbar.svelte";
  import NavbarBrand from "../src/NavbarBrand.svelte";
  import NavbarToggler from "../src/NavbarToggler.svelte";
  import UncontrolledDropdown from "../src/UncontrolledDropdown.svelte";
  import Input from "../src/Input.svelte";

  let collapsed = false;
  const toggle = () => collapsed = !collapsed;

  export let light = false;
  export let dark = true;
  export let color = "dark";
  export let expand = "md";
  export let fixed;
</script>

<Navbar {color} {light} {dark} {expand} {fixed}>
  <NavbarBrand href="/">sveltestrap</NavbarBrand>
  <NavbarToggler on:click={toggle} />
  <Collapse isOpen={collapsed} navbar>
    <Nav class="ml-auto" navbar>
      <NavItem>
        <NavLink href="/components/">Components</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="https://github.com/bestguy/sveltestrap">
          GitHub
        </NavLink>
      </NavItem>
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret>Options</DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>Option 1</DropdownItem>
          <DropdownItem>Option 2</DropdownItem>
          <DropdownItem divider />
          <DropdownItem>Reset</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </Nav>
  </Collapse>
</Navbar>
