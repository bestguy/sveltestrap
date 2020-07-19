<script lang="typescript">
  import Alert from './Alert.svelte';

  let isOpen = true;
</script>

<Alert {...$$restProps} {isOpen} toggle={() => (isOpen = false)}>
  <slot />
</Alert>
