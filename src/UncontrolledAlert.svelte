<script>
  import Alert from './Alert.svelte';

  let isOpen = true;
  let { children: _children, ...props } = $$props;
</script>

<Alert {...props} {isOpen} toggle="{() => isOpen = false}">
  <slot />
</Alert>
