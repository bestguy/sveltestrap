<script>
  import { setContext } from 'svelte';
  import Nav from './Nav.svelte';

  setContext('tabs', true);
</script>

<Nav {...$$restProps}>
  <slot />
</Nav>
