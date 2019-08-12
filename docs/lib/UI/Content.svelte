<script>
	import { Container, Row, Col, Nav, NavItem } from 'sveltestrap';
	import NavLink from './NavLink.svelte';

	export let title;
	export let items;
	export let selected = '';
</script>

<Container class="content">
	<Row>
		<main class="docSearch-navigation col-md-3 order-md-2">
			<div class="mb-3">
				<h1 class="h5">{title}</h1>
				<Nav class="flex-column" pills>
					{#each items.sort((a, b) => a.name.localeCompare(b.name)) as item}
						<NavItem key={item.to}>
							<NavLink to="{item.to}">{item.name}</NavLink>
						</NavItem>
					{/each}
				</Nav>
			</div>
		</main>
		<aside class="docSearch-content col-md-9 order-md-1">
			<slot />
		</aside>
	</Row>
</Container>
