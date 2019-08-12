<script>
  import Button from "../src/Button.svelte";
  import { buttonColors } from "./colors";

  let colors = buttonColors;
  export let block;
  export let disabled;
  export let size;
  export let text = 'Hello World!';
  export let color = 'primary';
</script>

<Button
  class="mr-1"
  {block}
  {color}
  {disabled}
  {size}
  on:click
>
  {text}
</Button>
