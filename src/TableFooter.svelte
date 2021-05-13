<script>
  import { setContext } from 'svelte';

  setContext('footer', true);
</script>

<tfoot {...$$restProps}>
  <tr>
    <slot />
  </tr>
</tfoot>
