<script>
  import Badge from "../src/Badge.svelte";
  import { colors } from "./colors";
</script>

<div class="py-3">
  <h2>Colors</h2>
  {#each colors as color}
    <div>
      <Badge {color}>
        {color}
      </Badge>
    </div>
  {/each}
</div>

<div class="py-3">
  <h2>Pills</h2>
  {#each colors as color}
    <div>
      <Badge {color} pill>
        {color}
      </Badge>
    </div>
  {/each}
</div>
