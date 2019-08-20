<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'input-group-text',
  );
</script>

<span {...props} class="{classes}">
  <slot />
</span>
