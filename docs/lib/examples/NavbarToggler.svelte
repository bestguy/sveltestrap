<script>
	import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'sveltestrap';

	let isOpen = true;
</script>

<Navbar color="faded" light>
	<NavbarBrand href="/" class="mr-auto">sveltestrap</NavbarBrand>
	<NavbarToggler on:click="{() => isOpen = !isOpen}" className="mr-2" />
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
