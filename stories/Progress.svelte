<script>
  import Progress from "../src/Progress.svelte";
  import { colors } from "./colors";
</script>

<div class="py-3">
  <h3>Colors</h3>
  {#each colors as color, i}
    <div class="mb-2">
      <Progress {color} value={25 + i * 10}>
        {color}
      </Progress>
    </div>
  {/each}
</div>

<div class="py-3">
  <h3>Animated</h3>
  {#each colors as color, i}
    <div class="mb-2">
      <Progress animated striped {color} value={25 + i * 10}>
        {color}
      </Progress>
    </div>
  {/each}
</div>

<div class="py-3">
  <h3>Multiple bars</h3>
  <div class="mb-2">
    <Progress multi>
      <Progress bar value="25" />
      <Progress bar color="success" value="20" />
      <Progress bar color="info" value="15" />
      <Progress bar color="warning" value="10" />
      <Progress bar color="danger" value="5" />
    </Progress>
  </div>
  <div class="mb-2">
    <Progress multi>
      <Progress bar value="15">15</Progress>
      <Progress bar color="success" value="30">30</Progress>
      <Progress bar color="info" value="25">25</Progress>
      <Progress bar color="warning" value="20">20</Progress>
      <Progress bar color="danger" value="5">5</Progress>
    </Progress>
  </div>
</div>

