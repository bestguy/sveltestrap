<script lang="ts">
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
  } from 'sveltestrap';
  let isOpen = false;

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }
  const widths = [
    'sm',
    'md',
    'lg',
    'xl',
    'xxl',
    'fluid'
  ];
</script>

{#each widths as w}
  <Navbar color="light" light expand="md" container={w}>
    <NavbarBrand href="/">NavBar with {w} container</NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
      <Nav class="ms-auto" navbar>
        <NavItem>
          <NavLink href="#components/">Components</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="https://github.com/bestguy/sveltestrap">GitHub</NavLink>
        </NavItem>
        <Dropdown nav inNavbar>
          <DropdownToggle nav caret>Options</DropdownToggle>
          <DropdownMenu end>
            <DropdownItem>Option 1</DropdownItem>
            <DropdownItem>Option 2</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Reset</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Nav>
    </Collapse>
  </Navbar>
{/each}

