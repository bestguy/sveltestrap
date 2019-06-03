<script>
	import { Button, Card, CardBody, CardText, CardGroup, CardTitle } from 'sveltestrap';
</script>

<CardGroup>
	<Card>
		<CardBody>
			<CardTitle>

				<Button close />

			</CardTitle>
			<CardText>Default close icon</CardText>
		</CardBody>
	</Card>

	<Card>
		<CardBody>
			<CardTitle>

				<Button close aria-label="Cancel">
					<span aria-hidden="true">&ndash;</span>
				</Button>

			</CardTitle>
			<CardText>
				Custom content and aria-label
			</CardText>
		</CardBody>
	</Card>
</CardGroup>
