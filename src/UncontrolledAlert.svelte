<script>
  import Alert from './Alert.svelte';
</script>

<Alert {...$$restProps} dismissible>
  <slot />
</Alert>
