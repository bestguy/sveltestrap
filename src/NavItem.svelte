<script>
  import clsx from 'clsx';

  let className = '';
  export {className as class};
  export let active = false;

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'nav-item',
    active ? 'active' : false
  );
</script>

<li {...props} class="{classes}">
  <slot/>
</li>
