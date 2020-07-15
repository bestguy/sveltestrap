<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };


  $: classes = clsx(className, 'input-group-text');
</script>

<span {...$$restProps} class={classes}>
  <slot />
</span>
