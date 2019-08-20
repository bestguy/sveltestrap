<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let size = '';

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'input-group',
    size ? `input-group-${size}` : null,
  );
</script>

<div {...props} class="{classes}">
  <slot/>
</div>
