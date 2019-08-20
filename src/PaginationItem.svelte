<script>
  import clsx from 'clsx';

  let className = '';
  export {className as class};
  export let active = false;
  export let disabled = false;

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'page-item',
    {
      active,
      disabled,
    },
  );
</script>

<li {...props} class="{classes}">
  <slot />
</li>
