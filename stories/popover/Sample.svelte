<script lang="ts">
  import Popover from '../../src/Popover.svelte';
  import { Button } from 'sveltestrap';

  const placements: string[] = ['top', 'right', 'left', 'bottom'];
</script>

{#each placements as placement}
  <div class="mt-3">
    <Button id={`btn-${placement}`}>Click for {placement}</Button>
    <Popover target={`btn-${placement}`} {placement} title={`Popover ${placement}`}>
      This is a Popover on the {placement} of the trigger.
    </Popover>
  </div>
{/each}