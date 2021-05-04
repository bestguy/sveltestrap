<script>
  import { setContext } from 'svelte';

  setContext('colgroup', true);
</script>

<colgroup>
  <slot />
</colgroup>
