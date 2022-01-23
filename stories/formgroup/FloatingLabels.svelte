<script lang="ts">
  import { Badge, Form, FormGroup, Input, Label } from 'sveltestrap';
</script>

<Form>
  <FormGroup floating label="Floating Label">
    <Input placeholder="Enter a value" />
  </FormGroup>

  <FormGroup floating>
    <Input placeholder="Enter a value" />
    <div slot="label">
      Floating Label Slot <Badge>3</Badge>
    </div>
  </FormGroup>

</Form>
