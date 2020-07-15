<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };


  $: classes = clsx(className, 'card-text');
</script>

<p {...$$restProps} class={classes}>
  <slot />
</p>
