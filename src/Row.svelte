<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let noGutters = false;
  export let form = false;
  export let id = '';


  $: classes = clsx(
    className,
    noGutters ? 'no-gutters' : null,
    form ? 'form-row' : 'row'
  );
</script>

<div {...$$restProps} {id} class={classes}>
  <slot />
</div>
