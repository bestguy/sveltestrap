<script>
  import Alert from './Alert.svelte';
  import { clean } from './utils';

  let isOpen = true;
  const props = clean($$props);
</script>

<Alert {...props} {isOpen} toggle="{() => isOpen = false}">
  <slot />
</Alert>
