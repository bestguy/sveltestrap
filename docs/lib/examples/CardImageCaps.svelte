<script>
	import { Card, CardBody, CardTitle, CardText, CardImg } from 'sveltestrap';
</script>

<Card>
	<CardImg top width="100%" src="https://via.placeholder.com/318x180.png?text=318%C3%97180" alt="Card image cap" />
	<CardBody>
		<CardTitle>Card Title</CardTitle>
		<CardText>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</CardText>
		<CardText>
			<small className="text-muted">Last updated 3 mins ago</small>
		</CardText>
	</CardBody>
</Card>
<Card>
	<CardBody>
		<CardTitle>Card Title</CardTitle>
		<CardText>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</CardText>
		<CardText>
			<small className="text-muted">Last updated 3 mins ago</small>
		</CardText>
	</CardBody>
	<CardImg bottom width="100%" src="https://via.placeholder.com/318x180.png?text=318%C3%97180" alt="Card image cap" />
</Card>
