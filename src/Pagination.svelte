<script>
  import clsx from 'clsx';

  let className = '';
  export {className as class};
  export let listClassName = '';
  export let size = '';
  export let ariaLabel = 'pagination';

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className
  );

  $: listClasses = clsx(
    listClassName,
    'pagination',
    {
      [`pagination-${size}`]: !!size,
    },
  );
</script>

<nav {...props} class="{classes}" aria-label="{ariaLabel}">
  <ul class="{listClasses}">
    <slot />
  </ul>
</nav>
