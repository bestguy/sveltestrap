<script>
	import NavLink from './NavLink.svelte';
	import { NavbarToggler, Container, Collapse, Navbar, NavbarBrand, Nav, NavItem } from 'sveltestrap';

	let showNavBar = false;
	export let segment;
</script>

<Navbar class="header" color="faded" light expand="md">
	<Container>
		<NavbarBrand class="mr-auto" href="/">
			<NavLink to="/">
				sveltestrap
			</NavLink>
		</NavbarBrand>
		<NavbarToggler on:click="{() => showNavBar = !showNavBar}" />
		<Collapse navbar isOpen={showNavBar}>
			<Nav navbar class="ml-sm-auto">
				<NavItem>
					<NavLink to="components/alerts" class="nav-link">
						Components
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="https://github.com/bestguy/sveltestrap">GitHub</NavLink>
				</NavItem>
			</Nav>
		</Collapse>
	</Container>
</Navbar>
