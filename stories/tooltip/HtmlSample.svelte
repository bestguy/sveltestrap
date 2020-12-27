<script lang="ts">
  import Tooltip from '../../src/Tooltip.svelte';
  import { Button } from 'sveltestrap';

  let string = `<strong>Hello</strong> world!`;
</script>

<div>
  <Button id="btn-right-html">HTML right</Button>
  <Tooltip target="btn-right-html" placement="right">{@html string}</Tooltip>
</div>