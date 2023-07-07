<script lang="ts">
  import { Button, Form, FormGroup, Input } from 'sveltestrap';

  let validated = false;
</script>

<Form {validated} on:submit={(e) => e.preventDefault()}>
  <FormGroup>
    <Input
      feedback="This requires a value"
      placeholder="This requires a value"
      required
    />
  </FormGroup>
  <FormGroup>
    <Input
      feedback="This requires an email"
      placeholder="This requires an email"
      required
      type="email"
    />
  </FormGroup>
  <Button type="submit" on:click={() => (validated = true)}>Fake Submit</Button>
</Form>
