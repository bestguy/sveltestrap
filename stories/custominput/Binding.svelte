<script lang="ts">
  import { FormGroup, CustomInput, Label } from 'sveltestrap';

  let inputValue = '';
</script>

<FormGroup>
  <Label>Pick an option</Label>
  <CustomInput type="select" bind:value={inputValue}>
    <option />
    <option value={1}>Uno</option>
    <option value={2}>Dos</option>
    <option value={3}>Tres</option>
    <option value={4}>Quatro</option>
  </CustomInput>
</FormGroup>
{#if inputValue}
  <p>You selected: {inputValue}</p>
{/if}
