<script lang="ts">
  import { FormGroup, Input, Label } from 'sveltestrap';

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
  <Label>Type here</Label>
  <Input
    type="text"
    value={inputValue}
    on:blur={() => (focused = false)}
    on:focus={() => (focused = true)}
    on:change={changeEvent}
    on:input={inputEvent} />
</FormGroup>
{#if changeValue}
  <p>
    <code>on:change</code>
    says you typed: {changeValue}
  </p>
{/if}
{#if inputValue}
  <p>
    <code>on:input</code>
    says you are typing: {inputValue}
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
