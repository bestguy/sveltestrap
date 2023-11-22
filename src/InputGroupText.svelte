<script>
  import classnames from './utils.ts';

  let className = '';
  export { className as class };

  $: classes = classnames(className, 'input-group-text');
</script>

<span {...$$restProps} class={classes}>
  <slot />
</span>
