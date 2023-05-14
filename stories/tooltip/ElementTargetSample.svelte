<script lang="ts">
  import { Tooltip } from 'sveltestrap';
  let myHtmlElementA, myHtmlElementB;
</script>

<div class="mt-3">
  <div style="background: lightgreen" bind:this={myHtmlElementA}>A</div>
  <Tooltip target={myHtmlElementA}>A</Tooltip>
</div>

<div class="mt-3">
  <div style="background: lightblue" bind:this={myHtmlElementB}>B</div>
  <Tooltip target={myHtmlElementB}>B</Tooltip>
</div>
