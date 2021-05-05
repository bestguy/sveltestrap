<script>
  import { setContext } from 'svelte';

  setContext('header', true);
</script>

<thead>
  <tr>
    <slot />
  </tr>
</thead>
