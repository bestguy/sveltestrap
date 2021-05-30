<script lang="ts">
  import { FormGroup, Input, Label } from 'sveltestrap';

  let inputValue = '';

  let root: HTMLTextAreaElement;
  const resize = () => {
    root.style.height = 'auto';
    root.style.height = 4 + root.scrollHeight + 'px';
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
  <Input rows={1} type="textarea" bind:root on:input={resize} />
</FormGroup>
