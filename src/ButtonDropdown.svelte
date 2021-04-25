<script>
  import Dropdown from './Dropdown.svelte';
</script>

<Dropdown
  {...$$restProps}
  group
  on:click>
  <slot />
</Dropdown>
