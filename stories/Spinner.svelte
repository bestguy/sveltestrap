<script>
  import Spinner from "../src/Spinner.svelte";
  import { colors } from "./colors";
  export let size;
  export let type = 'border';
  export let color = '';
</script>

<Spinner {color} {type} {size} />

<div class="py-3">
  <h2>Colors</h2>
  <div>
    {#each colors as color}
      <Spinner {color} />
    {/each}
  </div>
</div>

<div class="py-3">
  <h2>Size</h2>
  <div>
    <Spinner size="lg" />
    <Spinner size="sm" />
  </div>
</div>

<div class="py-3">
  <h2>Grow</h2>
  <div>
    {#each colors as color}
      <Spinner {color} type="grow" />
    {/each}
  </div>
</div>

