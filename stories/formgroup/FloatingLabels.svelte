<script lang="ts">
  import { Badge, Form, FormGroup, Input } from 'sveltestrap';
</script>

<Form>
  <FormGroup floating label="Floating Label">
    <Input placeholder="Enter a value" />
  </FormGroup>

  <FormGroup floating label="Select labels always float">
    <Input type="select" placeholder="Enter a value">
      <option />
      <option value="alpha">Alpha</option>
      <option value="bravo">Bravo</option>
      <option value="charlie">Charlie</option>
    </Input>
  </FormGroup>

  <FormGroup floating>
    <Input placeholder="Enter a value" />
    <div slot="label">
      Floating Label Slot <Badge>3</Badge>
    </div>
  </FormGroup>
</Form>
