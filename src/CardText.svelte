<script>
  import classnames from './utils.ts';

  let className = '';
  export { className as class };

  $: classes = classnames(className, 'card-text');
</script>

<p {...$$restProps} class={classes}>
  <slot />
</p>
