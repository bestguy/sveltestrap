<script>
	import Card from '../../../src/Card.svelte';
	import CardImg from '../../../src/CardImg.svelte';
	import CardImgOverlay from '../../../src/CardImgOverlay.svelte';
	import CardTitle from '../../../src/CardTitle.svelte';
	import CardText from '../../../src/CardText.svelte';
</script>

<Card>
	<CardImg src="./thumbsup.jpg" />
	<CardImgOverlay>
		<CardTitle>Card Title</CardTitle>
		<CardText>Card text</CardText>
	</CardImgOverlay>
</Card>
