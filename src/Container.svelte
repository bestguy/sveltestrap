<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let sm = undefined;
  export let md = undefined;
  export let lg = undefined;
  export let xl = undefined;
  export let xxl = undefined;
  export let fluid = false;

  $: classes = classnames(className, {
    'container-sm': sm,
    'container-md': md,
    'container-lg': lg,
    'container-xl': xl,
    'container-xxl': xxl,
    'container-fluid': fluid,
    container: !sm && !md && !lg && !xl && !xxl && !fluid
  });
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
