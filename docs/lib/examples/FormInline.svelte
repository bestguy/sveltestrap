<script>
	import { Button, Form, FormGroup, Label, Input } from 'sveltestrap';
</script>

<Form inline>
	<FormGroup class="mb-2 mr-sm-2 mb-sm-0">
		<Label for="exampleEmail" class="mr-sm-2">Email</Label>
		<Input type="email" name="email" id="exampleEmail" placeholder="something@idk.cool" />
	</FormGroup>
	<FormGroup class="mb-2 mr-sm-2 mb-sm-0">
		<Label for="examplePassword" class="mr-sm-2">Password</Label>
		<Input type="password" name="password" id="examplePassword" placeholder="don't tell!" />
	</FormGroup>
	<Button>Submit</Button>
</Form>
