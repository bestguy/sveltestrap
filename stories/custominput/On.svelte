<script lang="ts">
  import { FormGroup, CustomInput, Label } from 'sveltestrap';

  let changeValue = '';
  let inputValue = '';
  let focused = false;

  // need events outside template, typescript is not first-class supported inline :(
  const changeEvent = (e: Event) => {
    changeValue = (e.target as HTMLInputElement).value;
  };

  const inputEvent = (e: Event) => {
    inputValue = (e.target as HTMLInputElement).value;
  };
</script>

<FormGroup>
  <Label>Pick an option</Label>
  <CustomInput
    type="select"
    value={inputValue}
    on:blur={() => (focused = false)}
    on:focus={() => (focused = true)}
    on:change={changeEvent}
    on:input={inputEvent}>
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
