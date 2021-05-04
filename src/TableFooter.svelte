<script>
  import { setContext } from 'svelte';

  setContext('footer', true);
</script>

<tfoot>
  <tr>
    <slot />
  </tr>
</tfoot>
