<script>
  import Button from "../src/Button.svelte";
  import ButtonGroup from "../src/ButtonGroup.svelte";
  import { buttonColors } from "./colors";
</script>

<div class="py-3">
  <h2>Colors</h2>
  <div>
    {#each buttonColors as color}
      <Button class="mr-1" {color} on:click>{color}</Button>
    {/each}
  </div>
</div>

<div class="py-3">
  <h2>Outline</h2>
  <div>
    {#each buttonColors as color}
      <Button class="mr-1" {color} outline on:click>{color}</Button>
    {/each}
  </div>
</div>

<div class="py-3">
  <h2>Sizes</h2>
  <Button size="lg">Large</Button>
  <Button size="sm">Small</Button>
  <Button block>Block</Button>
</div>

<div class="py-3">
  <h2>Disabled</h2>
  <Button disabled>Disabled</Button>
</div>

<div class="py-3">
  <h2>Button Groups</h2>
  <ButtonGroup>
    <Button active>Alpha</Button>
    <Button>Bravo</Button>
    <Button>Charlie</Button>
  </ButtonGroup>
</div>
