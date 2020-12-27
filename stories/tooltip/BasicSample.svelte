<script lang="ts">
  import Tooltip from '../../src/Tooltip.svelte';
  import { Button } from 'sveltestrap';

  const placements: string[] = ['left', 'top', 'bottom', 'right'];
</script>

{#each placements as placement}
    <Button id={`btn-${placement}`}>{placement}</Button>
    <Tooltip target={`btn-${placement}`} {placement}>{placement}</Tooltip>
{/each}
