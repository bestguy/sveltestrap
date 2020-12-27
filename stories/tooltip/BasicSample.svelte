<script lang="ts">
  import Tooltip from '../../src/Tooltip.svelte';
  import { Button } from 'sveltestrap';

  const placements: string[] = ['top', 'right', 'left', 'bottom'];
</script>

{#each placements as placement}
  <div class="mt-3">
    <Button id={`btn-${placement}`}>{placement}</Button>
    <Tooltip target={`btn-${placement}`} {placement}>{placement}</Tooltip>
  </div>
{/each}
