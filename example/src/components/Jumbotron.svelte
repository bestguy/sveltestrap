<script>
	import Jumbotron from '../../../src/Jumbotron.svelte';
	import Container from '../../../src/Container.svelte';
	import Button from '../../../src/Button.svelte';
</script>

<Jumbotron>
	<h1 className="display-3">Hello, world!</h1>
	<p className="lead">This is a simple hero unit, a simple Jumbotron-style component for calling extra attention to featured content or information.</p>
	<hr className="my-2" />
	<p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
	<p className="lead">
		<Button color="primary">Learn More</Button>
	</p>
</Jumbotron>

<Jumbotron fluid>
	<Container fluid>
		<h1 className="display-3">Fluid jumbotron</h1>
		<p className="lead">This is a modified jumbotron that occupies the entire horizontal space of its parent.</p>
	</Container>
</Jumbotron>
