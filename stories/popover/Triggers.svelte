<script lang="ts">
  import Popover from '../../src/Popover.svelte';
  import { Button } from 'sveltestrap';
</script>

<div class="mt-3">
  <Button id="btn-trigger">Hover me</Button>
  <Popover
    hover
    placement="right"
    target="btn-trigger"
    title="Popover with hover">
    This is a Popover with hover as the trigger.
  </Popover>
</div>
