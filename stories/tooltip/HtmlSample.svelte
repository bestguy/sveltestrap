<script lang="ts">
  import Tooltip from '../../src/Tooltip.svelte';
  import { Button } from 'sveltestrap';

  let string = `<strong>Hello</strong> world!`;
</script>

<div>
  <Button id="btn-top-html">HTML TOP</Button>
  <Tooltip target="btn-top-html" placement="top">{@html string}</Tooltip>
</div>