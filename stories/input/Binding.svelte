<script lang="ts">
  import { FormGroup, Input, Label } from 'sveltestrap';

  let inputValue = '';

  let inner: HTMLTextAreaElement;
  const resize = () => {
    inner.style.height = 'auto';
    inner.style.height = 4 + inner.scrollHeight + 'px';
  };
</script>

<FormGroup>
  <Label>Type here</Label>
  <Input type="text" bind:value={inputValue} />
</FormGroup>
{#if inputValue}
  <p>You typed: {inputValue}</p>
{/if}

<FormGroup>
  <Label>This textarea resizes as you type</Label>
  <Input rows={1} type="textarea" bind:inner on:input={resize} />
</FormGroup>
