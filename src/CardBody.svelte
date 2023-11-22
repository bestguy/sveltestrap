<script>
  import classnames from './utils.ts';

  let className = '';
  export { className as class };

  $: classes = classnames(className, 'card-body');
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
