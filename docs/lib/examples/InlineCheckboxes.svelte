<script>
	import { Form, FormGroup, Label, Input } from 'sveltestrap';
</script>

<Form>
	<FormGroup check inline>
		<Label check>
			<Input type="checkbox" /> Some input
		</Label>
	</FormGroup>
	<FormGroup check inline>
		<Label check>
			<Input type="checkbox" /> Some other input
		</Label>
	</FormGroup>
</Form>
