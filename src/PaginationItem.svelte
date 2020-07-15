<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let active = false;
  export let disabled = false;


  $: classes = clsx(className, 'page-item', {
    active,
    disabled
  });
</script>

<li {...$$restProps} class={classes}>
  <slot />
</li>
