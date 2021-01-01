<script lang="ts">
  import Popover from '../../src/Popover.svelte';
  import { Button } from 'sveltestrap';

  const placements: string[] = ['top', 'right', 'left', 'bottom'];
</script>

{#each placements as placement}
  <div class="mt-3">
    <Button id={`btn-${placement}`}>{placement}</Button>
    <Popover target={`btn-${placement}`} {placement} title={placement}>
      {placement}
    </Popover>
  </div>
{/each}