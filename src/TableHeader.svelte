<script>
  import { setContext } from 'svelte';

  setContext('header', true);
</script>

<thead {...$$restProps}>
  <tr>
    <slot />
  </tr>
</thead>
