<script>
  import { onMount, onDestroy } from 'svelte';
  let ref;
  let portal;

  onMount(() => {
    portal = document.createElement('div');
    document.body.appendChild(portal);
    portal.appendChild(ref);
  });

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.body.removeChild(portal);
    }
  });
</script>

<div bind:this={ref}>
  <slot />
</div>
