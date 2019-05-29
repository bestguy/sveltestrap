<script>
	import Card from '../../../src/Card.svelte';
	import CardHeader from '../../../src/CardHeader.svelte';
	import CardBody from '../../../src/CardBody.svelte';
	import CardTitle from '../../../src/CardTitle.svelte';
	import CardText from '../../../src/CardText.svelte';
	import CardSubtitle from '../../../src/CardSubtitle.svelte';
	import CardFooter from '../../../src/CardFooter.svelte';
</script>

<Card>
	<CardHeader>
		Card Header
	</CardHeader>
	<CardBody>
		<CardTitle>Card Title</CardTitle>
		<CardSubtitle>Card subtitle</CardSubtitle>
		<CardText>Card text</CardText>
	</CardBody>
	<CardFooter>
		Card Footer
	</CardFooter>
</Card>

