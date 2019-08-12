<script>
  import Alert from "../src/Alert.svelte";
  import PrismCode from './PrismCode.svelte';
  import { colors } from "./colors";
  export let color;
  export let source;
</script>

<h1>Alerts</h1>
<a href="https://getbootstrap.com/docs/4.3/components/alerts/" target="_blank">Bootstrap Alerts</a>

<div class="py-3">
  <h2>Live Example</h2>
  <Alert {color} on:click>
    <h4 class="alert-heading text-capitalize">{color}</h4>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </Alert>
</div>

<div class="py-3">
  <h2>Colors</h2>
  {#each colors as color}
    <Alert {color} on:click>
      <h4 class="alert-heading text-capitalize">{color}</h4>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </Alert>
  {/each}
</div>

<PrismCode>
  {source}
</PrismCode>
