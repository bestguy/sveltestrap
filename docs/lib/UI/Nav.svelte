<script>
	import { NavbarToggler, Container, Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'sveltestrap';

	let showNavBar = false;
</script>

<Navbar class="header" color="faded" light expand="md">
	<Container>
		<NavbarBrand class="mr-auto" tag="a" href="/">reactstrap</NavbarBrand>
		<NavbarToggler on:click="{() => showNavBar = !showNavBar}" />
		<Collapse navbar isOpen={showNavbar}>
			<Nav navbar class="ml-sm-auto">
				<NavItem>

				</NavItem>
				<NavItem>
					<NavLink tag={Link} to="/components/" activeClassName="active">Components</NavLink>
				</NavItem>
				<NavItem>
					<NavLink tag={Link} to="/utilities/" activeClassName="active">Utilities</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
				</NavItem>
			</Nav>
		</Collapse>
	</Container>
</Navbar>
