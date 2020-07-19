<script>
  import { FormGroup, CustomInput, Label } from 'sveltestrap';

  let changeValue = '';
  let inputValue = '';
  let focused = false;
</script>

<FormGroup>
  <Label>Pick an option</Label>
  <CustomInput
    type="select"
    value={inputValue}
    on:blur={() => (focused = false)}
    on:focus={() => (focused = true)}
    on:change={(e) => (changeValue = e.target.value)}
    on:input={(e) => (inputValue = e.target.value)}>
    <option />
    <option value={1}>Uno</option>
    <option value={2}>Dos</option>
    <option value={3}>Tres</option>
    <option value={4}>Quatro</option>
  </CustomInput>
</FormGroup>
{#if changeValue}
  <p>
    <code>on:change</code>
    says you picked: {changeValue}
  </p>
{/if}
{#if inputValue}
  <p>
    <code>on:input</code>
    says you picked: {inputValue}
  </p>
{/if}
{#if !focused}
  <p>
    <code>on:blur</code>
    says you are not focused.
  </p>
{:else}
  <p>
    <code>on:focus</code>
    says you are focused.
  </p>
{/if}
