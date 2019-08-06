<script>
	import { Card, CardImg, CardText, CardBody, CardLink,
		CardTitle, CardSubtitle } from 'sveltestrap';
</script>

<Card>
	<CardBody>
		<CardTitle>Card title</CardTitle>
		<CardSubtitle>Card subtitle</CardSubtitle>
	</CardBody>
	<img style="width: 100%;" src="https://via.placeholder.com/318x180.png?text=318%C3%97180
" alt="Card image cap" />
	<CardBody>
		<CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
		<CardLink href="#">Card Link</CardLink>
		<CardLink href="#">Another Link</CardLink>
	</CardBody>
</Card>
