<script>
  import classnames from './utils.ts';

  let className = '';
  export { className as class };

  $: classes = classnames(className, 'card-subtitle');
</script>

<h6 {...$$restProps} class={classes}>
  <slot />
</h6>
