<script>
	import { Button, CardBody, Card, Fade } from 'sveltestrap';
	let isOpen = false;
</script>

<Button color="primary" on:click="{() => isOpen = !isOpen}" style="margin-bottom: 1rem;">Toggle</Button>
<Fade {isOpen}>
	<Card>
		<CardBody>
			Anim pariatur cliche reprehenderit,
			enim eiusmod high life accusamus terry richardson ad squid. Nihil
			anim keffiyeh helvetica, craft beer labore wes anderson cred
			nesciunt sapiente ea proident.
		</CardBody>
	</Card>
</Fade>
