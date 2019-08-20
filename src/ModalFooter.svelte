<script>
  import clsx from 'clsx';

  let className = '';
  export {className as class};

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'modal-footer',
  );
</script>

<div {...props} class="{classes}">
  <slot />
</div>
