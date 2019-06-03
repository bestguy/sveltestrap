<script>
	import { Collapse, Button, CardBody, Card } from 'sveltestrap';

	let isOpen = false;
	let status = 'Closed';

	function onEntering() {
		status = 'Opening...';
	}

	function onEntered() {
		status = 'Opened';
	}

	function onExiting() {
		status = 'Closing...';
	}

	function onExited() {
		status = 'Closed';
	}
</script>

<Button color="primary" on:click="{() => isOpen = !isOpen}" style="margin-bottom: 1rem;">Toggle</Button>
<h5>Current state: {status}</h5>
<Collapse
	{isOpen}
	onEntering={onEntering}
	onEntered={onEntered}
	onExiting={onExiting}
	onExited={onExited}
>
	<Card>
		<CardBody>
			Anim pariatur cliche reprehenderit,
			enim eiusmod high life accusamus terry richardson ad squid. Nihil
			anim keffiyeh helvetica, craft beer labore wes anderson cred
			nesciunt sapiente ea proident.
		</CardBody>
	</Card>
</Collapse>
