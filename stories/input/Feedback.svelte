<script lang="ts">
  import { FormGroup, Input } from 'sveltestrap';
</script>

<FormGroup>
  <Input value="Invalid input" invalid feedback="I could be wrong" />
</FormGroup>

<FormGroup>
  <Input value="Valid input" valid feedback="I could be right" />
</FormGroup>

<FormGroup>
  <Input
    value="Multiple feedback"
    valid
    feedback={['I could be black', 'I could be white']}
  />
</FormGroup>
