<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let ariaLabel = '';

  $: classes = classnames(className, 'btn-toolbar');
</script>

<div {...$$restProps} aria-label={ariaLabel} role="toolbar" class={classes}>
  <slot />
</div>
