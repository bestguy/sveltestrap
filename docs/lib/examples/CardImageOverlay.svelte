<script>
	import { Card, CardTitle, CardText, CardImg, CardImgOverlay } from 'sveltestrap';
</script>

<Card inverse>
	<CardImg width="100%" src="https://via.placeholder.com/318x270.png?text=318%C3%97270" alt="Card image cap" />
	<CardImgOverlay>
		<CardTitle>Card Title</CardTitle>
		<CardText>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</CardText>
		<CardText>
			<small class="text-muted">Last updated 3 mins ago</small>
		</CardText>
	</CardImgOverlay>
</Card>
