<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let noGutters = false;
  export let form = false;

  $: classes = classnames(
    className,
    noGutters ? 'no-gutters' : null,
    form ? 'form-row' : 'row'
  );
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
