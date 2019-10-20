<script>
  import { FormGroup, Input, Label } from 'sveltestrap';

  let inputValue = '';
</script>

<FormGroup>
  <Label>Type here</Label>
  <Input type="text" bind:value={inputValue} />
</FormGroup>
{#if inputValue}
  <p>You typed: {inputValue}</p>
{/if}
