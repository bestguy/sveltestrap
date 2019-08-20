<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let noGutters = false;
  export let form = false;
  export let id = '';

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    noGutters ? 'no-gutters' : null,
    form ? 'form-row' : 'row',
  );
</script>

<div {...props} {id} class="{classes}">
  <slot />
</div>
