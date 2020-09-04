<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let fluid = false;

  $: classes = classnames(className, fluid ? 'container-fluid' : 'container');
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
