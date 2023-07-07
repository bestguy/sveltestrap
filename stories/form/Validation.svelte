<script lang="ts">
  import { FormGroup, Input } from 'sveltestrap';
</script>

<FormGroup>
  <Input value="Bad value" feedback="Invalid feedback" invalid />
</FormGroup>

<FormGroup>
  <Input value="Correct value" feedback="Valid feedback" valid />
</FormGroup>

