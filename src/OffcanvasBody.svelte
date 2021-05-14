<script>
  import classnames from './utils';

  let className = '';
  export { className as class };

  $: classes = classnames(className, 'offcanvas-body');
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
