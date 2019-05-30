<script>
	import { NavbarToggler, Container, Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'sveltestrap';

	let showNavBar = false;
</script>

<Navbar class="header" color="faded" light expand="md">
	<Container>
		<NavbarBrand class="mr-auto" href="/#">sveltestrap</NavbarBrand>
		<NavbarToggler on:click="{() => showNavBar = !showNavBar}" />
		<Collapse navbar isOpen={showNavBar}>
			<Nav navbar class="ml-sm-auto">
				<NavItem>

				</NavItem>
				<NavItem>
					<NavLink href="/#components/" activeClassName="active">Components</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="/#utilities/" activeClassName="active">Utilities</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="https://github.com/bestguy/sveltestrap">GitHub</NavLink>
				</NavItem>
			</Nav>
		</Collapse>
	</Container>
</Navbar>
