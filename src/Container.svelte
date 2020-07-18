<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let fluid = false;
  export let id = '';


  $: classes = classnames(className, fluid ? 'container-fluid' : 'container');
</script>

<div {...$$restProps} {id} class={classes}>
  <slot />
</div>
